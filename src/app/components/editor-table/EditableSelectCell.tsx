"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Options} from "@/types";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import {Row} from "@tanstack/react-table";

interface EditableSelectCellProps {
  columnValue: string;
  row: Row<any>;
  column: {
    id: string;
  };
  table: {
    options: {
      meta?: {
        updateData: (
          rowIndex: number,
          columnId: string,
          value: unknown
        ) => void;
      };
    };
  };
  options: Options[];
  placeholder: string;
  onUpdate?: (value: string | number, item: any) => void;
  onSearch?: (s: string) => Promise<Options[]>;
  keyOfLabel?: string,
  onUpdateOptions?: (d: Options[]) => void;
}

export const EditableSelectCell = ({
                                     columnValue,
                                     row,
                                     column,
                                     table,
                                     options,
                                     placeholder,
                                     onUpdate,
                                     onSearch,
                                     keyOfLabel = "name",
                                     onUpdateOptions
                                   }: EditableSelectCellProps) => {
  const [selectedOption, setSelectedOption] = useState<Options | null>(
    options.find((opt) => opt.value === columnValue) || null
  );

  useEffect(() => {
    if (columnValue) {
      const current = options.find((opt) => opt.value === columnValue);
      if (current) {
        setSelectedOption(current)
      } else if (columnValue) {
        setSelectedOption({value: columnValue, label: row.original[keyOfLabel] || columnValue});
      }
    }
  }, [columnValue, options]);

  const handleChange = useCallback(
    (option: Options | null) => {
      setSelectedOption(option);
      if (option) {
        table.options.meta?.updateData(row.index, column.id, option.value);
        if (onUpdate) onUpdate(option.value, option?.data);
        if (onUpdateOptions) {
          let inOption = options.find((opt) => opt.value === option.value);
          if(!inOption) {
            options.push(option);
            onUpdateOptions(options)
          }
        }
      }
    },
    [row.index, column.id, table, onUpdate]
  );

  const loadOptions = (
    inputValue: string,
    callback: (options: Options[]) => void
  ) => {
    if(!onSearch) {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filtered);
    }else {
      onSearch(inputValue).then((result) => {
        let finalOptions = result;
        if (
          selectedOption &&
          !finalOptions.some((opt) => opt.value === selectedOption.value)
        ) {
          finalOptions = [selectedOption, ...finalOptions];
        }
        callback(finalOptions);
      });
    }
  }

  const debouncedLoadOptions = useCallback(
    debounce(loadOptions, 300),
    [onSearch, selectedOption]
  );

  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions={options}
        loadOptions={debouncedLoadOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        menuShouldScrollIntoView={false}
        menuPortalTarget={document.body}
        backspaceRemovesValue={false}
        blurInputOnSelect={false}
      />
    </div>
  );
};
