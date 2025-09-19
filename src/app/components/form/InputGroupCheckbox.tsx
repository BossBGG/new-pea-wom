"use client";

import * as React from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Options} from "@/types";
import {ChevronDown, ChevronUp} from "lucide-react";
import InputSearch from "@/app/components/form/InputSearch";
import {useCallback} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface CheckBoxGroupOfPeaOfficeProps {
  options: Options[],
  setData: (d: string[]) => void,
  showSelected?: boolean
  searchable?: boolean
}

export default function InputGroupCheckbox({
                                             options,
                                             setData,
                                             showSelected = true,
                                             searchable = true
                                           }: CheckBoxGroupOfPeaOfficeProps) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [search, setSearch] = React.useState<string>("");
  const [modifyOptions, setModifyOptions] = React.useState<Options[]>(options);

  const toggleExpand = (value: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const toggleOption = (option: Options, checked: boolean) => {
    const collectValues = (opt: Options): string[] => {
      if (opt.subOptions) {
        return [opt.value.toString(), ...opt.subOptions.flatMap(collectValues)];
      }
      return [opt.value.toString()];
    };

    const values = collectValues(option);
    setSelected((prev) => {
      if (checked) {
        let newValue = Array.from(new Set([...prev, ...values]));
        setData(newValue);
        return newValue;
      } else {
        let newValue = prev.filter((val) => !values.includes(val));
        setData(newValue || []);
        return newValue;
      }
    });
  };

  const onSearch = useCallback((s: string) => {
    if (s === '') {
      setModifyOptions(options);
      return
    }

    const searchLowerCase = s.toLowerCase();

    const filtered = options.filter((option) => {
      const matchParent =
        (option.value as string).toLowerCase().includes(searchLowerCase) ||
        option.label.toLowerCase().includes(searchLowerCase);

      const matchChild = option.subOptions?.some(
        (subOption) => {
          const matchSub =
            (subOption.value as string).toLowerCase().includes(searchLowerCase) ||
            subOption.label.toLowerCase().includes(searchLowerCase)

          const matchChild = subOption.subOptions?.some((child) =>
            (child.value as string).toLowerCase().includes(searchLowerCase) ||
            child.label.toLowerCase().includes(searchLowerCase)
          )

          return matchSub || matchChild
        }
      )

      return matchParent || matchChild;
    })

    setModifyOptions(filtered);
  }, [search, options])

  const getCheckedState = (option: Options): boolean | "indeterminate" => {
    if (!option.subOptions) {
      return selected.includes(option.value.toString());
    }else if(option.subOptions && option.subOptions.length === 0) {
      return selected.includes(option.value.toString());
    }

    const subValues = option.subOptions?.map(getCheckedState);

    if (subValues?.every((v) => v === true)) return true; //sub option ถูกเลือกทุกตัว
    if (subValues?.some((v) => v === true || v === "indeterminate"))
      return "indeterminate"; //sub option ถูกเลือกแค่บางตัว
    return false; //sub option ไม่ถูกเลือกเลย
  };

  /** render tree */
  const renderTree = (option: Options, level = 0) => {
    const checkedState = getCheckedState(option);
    const isExpanded = expanded.has(option.value.toString());

    return (
      <div key={option.value}>
        <div className={`flex items-center justify-between ${level !== 0 ? 'space-y-2' : 'space-y-1'}`}>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={
                checkedState === true
                  ? true
                  : checkedState === "indeterminate"
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(checked) =>
                toggleOption(option, checked === true)
              }
              className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer"
            />
            <span>{option.label}</span>
          </div>

          {option.subOptions && option.subOptions.length > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={() => toggleExpand(option.value.toString())}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4"/>
              ) : (
                <ChevronUp className="h-4 w-4"/>
              )}
            </Button>
          ) : (
            <div className="w-6"/>
          )}
        </div>

        {isExpanded && option.subOptions && (
          <div
            className={`pl-6 pt-3 ${level === 0 ? 'bg-[#F2F2F2]' : ''} ${level === 1 ? 'flex items-center flex-wrap bg-[#E0E0E0]' : ''}`}>
            {option.subOptions.map((sub) => renderTree(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center my-2">
        {
          showSelected && selected?.length > 0 &&
          selected.map((sel, index) =>
            <div className="bg-[#E4DCFF] px-2 py-1 rounded-sm text-[14px] mr-2 font-bold mb-1"
                 key={`select-${index}-${sel}`}
            >
              {sel}
              <FontAwesomeIcon icon={faXmark} className="ml-1"/>
            </div>
          )
        }
      </div>

      {
        searchable &&
        <div className="my-3">
          <InputSearch value={search}
                       handleSearch={onSearch}
                       setValue={setSearch}/>
        </div>
      }

      {
        (modifyOptions.map((opt) => renderTree(opt)))
      }
    </div>
  )
}
