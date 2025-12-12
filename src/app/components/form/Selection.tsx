"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Options} from "@/types";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";

interface SelectionProps {
  value: string;
  options: Options[];
  placeholder: string;
  onUpdate?: (value: string, item: any) => void;
  onSearch?: (s: string) => Promise<Options[]>;
  onUpdateOptions?: (d: Options[]) => void,
  disabled?: boolean;
}

export const Selection = ({
                            value,
                            options,
                            placeholder,
                            onUpdate,
                            onSearch,
                            onUpdateOptions,
                            disabled=false
                          }: SelectionProps) => {
  const [selectedOption, setSelectedOption] = useState<Options | null>(
    options.find((opt) => opt.value == value) || null
  );

  useEffect(() => {
    if (value) {
      const current = {value: value, label: value};
      setSelectedOption(
        options.find((opt) => opt.value == value) || current
      );
    }
  }, [value, options]);

  const handleChange = useCallback(
    (option: Options | null) => {
      console.log('handleChange', option);
      setSelectedOption(option);
      if (option) {
        if (onUpdate) onUpdate(option.value as string, option?.data);
        if (onUpdateOptions) {
          let inOption = options.find((opt) => opt.value == option.value);
          if (!inOption) {
            options.push(option);
            onUpdateOptions(options)
          }
        }
      }
    },
    [onUpdate]
  );

  const loadOptions = (inputValue: string, callback: (options: Options[]) => void) => {
    if (!onSearch) {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filtered);
    } else {
      onSearch(inputValue).then((result) => {
        // เอา selectedOption ออกจาก result ก่อน
        let finalOptions = result.filter((opt) =>
          !selectedOption || opt.value !== selectedOption.value
        );

        // ถ้าไม่มี inputValue (เปิด dropdown ครั้งแรก) และมี selectedOption
        // ให้เพิ่ม selectedOption กลับเข้าไป
        if (!inputValue && selectedOption) {
          finalOptions = [selectedOption, ...finalOptions];
        }
        callback(finalOptions);
      });
    }
  };

  const debouncedLoadOptions = useCallback(
    debounce(loadOptions, 300),
    [onSearch, selectedOption]
  );

  const fontSize = 14;
  const customStyles = {
    menuPortal: (base: any) => ({...base, zIndex: 9999}),
    input: (provided: any) => ({
      ...provided,
      height: 33,
      borderColor: '#DFE4EA'
    }),
    /*control: (provided: any) => ({
      ...provided,
      fontSize
    }),
    input: (provided: any) => ({
      ...provided,
      fontSize
    }),
    singleValue: (provided: any) => ({
      ...provided,
      fontSize
    }),
    option: (provided: any) => ({
      ...provided,
      fontSize
    }),*/
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={options}
      loadOptions={debouncedLoadOptions as any}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      menuShouldScrollIntoView={true}
      menuShouldBlockScroll={false}
      menuPortalTarget={null}
      backspaceRemovesValue={false}
      blurInputOnSelect={false}
      styles={customStyles}
      isDisabled={disabled}
    />
  );
};
