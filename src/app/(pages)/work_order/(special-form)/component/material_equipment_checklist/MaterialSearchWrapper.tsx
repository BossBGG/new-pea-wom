import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Options, MaterialSet, MaterialMaster } from "@/types";
import {
  getMaterialSets,
  getMaterialMaster,
} from "@/app/api/MaterialEquipmentApi";
import InputSearchSelect from "@/app/components/form/InputSearchSelect";
import InputSearch from "@/app/components/form/InputSearch";
import debounce from "lodash/debounce";

interface MaterialSearchWrapperProps {
  type: "sets" | "search";
  value: string;
  placeholder: string;
  label: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MaterialSearchWrapper = ({
  type,
  value,
  placeholder,
  label,
  onChange,
  disabled = false,
}: MaterialSearchWrapperProps) => {
  const [options, setOptions] = useState<Options[]>([]);
  const [loading, setLoading] = useState(false);

  const [localSearchValue, setLocalSearchValue] = useState<string>(value);

  const fetchMaterialSets = useCallback(async (search: string = "") => {
    setLoading(true);
    try {
      const response = await getMaterialSets(search);
      if (response.status === 200 && response.data.data) {
        const materialSets = response.data.data.items;
        const formattedOptions: Options[] = materialSets.map(
          (set: MaterialSet) => ({
            label: set.name,
            value: set.uuid,
            data: set,
          })
        );
        setOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching material sets:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaterialMaster = useCallback(async (search: string = "") => {
    if (!search.trim()) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getMaterialMaster(search);
      if (response.status === 200 && response.data.data) {
        const materials = response.data.data;
        const formattedOptions: Options[] = materials.map(
          (material: MaterialMaster) => ({
            label: `${material.code} - ${material.name}`,
            value: material.code,
            data: material,
          })
        );
        setOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearchMaster = useMemo(
    () =>
      debounce((search: string) => {
        fetchMaterialMaster(search);
      }, 500),
    [fetchMaterialMaster]
  );

  useEffect(() => {
    setLocalSearchValue(value);
  }, [value]);

  useEffect(() => {
    if (type === "sets") {
      fetchMaterialSets();
    }
  }, [type, fetchMaterialSets]);

  useEffect(() => {
    return () => {
      debouncedSearchMaster.cancel();
    };
  }, [debouncedSearchMaster]);

  const handleSearch = useCallback(
    (search: string) => {
      setLocalSearchValue(search);
      onChange(search);

      if (type === "search") {
        debouncedSearchMaster(search);
      }
    },
    [onChange, type, debouncedSearchMaster]
  );

  const handleSetValue = useCallback((search: string) => {
    setLocalSearchValue(search);
  }, []);

  const handleSelectChange = useCallback(
    (selectedValue: string) => {
      onChange(selectedValue);
    },
    [onChange]
  );

  if (disabled) {
    return (
      <div className="mb-3">
        {label && <div className="mb-2 text-sm font-medium">{label}</div>}
        <div className="w-full h-[45px] px-3 py-2 border rounded-md bg-gray-100 text-gray-500 flex items-center">
          {type === "sets"
            ? value
              ? options.find((opt) => opt.value === value)?.label || value
              : placeholder
            : value || placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      {label && <div className="mb-2 text-sm font-medium">{label}</div>}

      {type === "sets" ? (
        <InputSearchSelect
          selectOptions={options}
          fetchOptions={fetchMaterialSets}
          onChange={handleSelectChange}
          loading={loading}
          value={value}
          placeholder={placeholder}
        />
      ) : (
        <InputSearch
          value={localSearchValue}
          handleSearch={handleSearch}
          setValue={handleSetValue}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default MaterialSearchWrapper;
