'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {Options} from "@/types";
import InputRadio from "@/app/components/form/InputRadio";
import { useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {cn} from "@/lib/utils";

type InputSelectProps = {
  options: Options[],
  value: string;
  label?: string;
  placeholder: string;
  setData?: (value: string) => void;
  disabled?: boolean;
}

const InputSelect = ({
                       value,
                       options,
                       label,
                       placeholder,
                       setData,
                       disabled=false
                     }: InputSelectProps) => {
  const [expandIndex, setExpandIndex] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [selectedSubValue, setSelectedSubValue] = useState<string | null>(null)
  const [selectedSubLabel, setSelectedSubLabel] = useState<string | null>(null)

  const handleChangeSubValue = (value: string, subOption: Options[] = []) => {
    const item = subOption.filter((sub) => value === sub.value)
    setSelectedSubValue(value)
    if (item?.length > 0) {
      setSelectedSubLabel(item[0].label)
    }
    
    // เพิ่มบรรทัดนี้เพื่ออัพเดทค่าไปยัง parent component
    if(setData) {
      setData(value)
    }
  }

  const handleChangeSelect = (value: string) => {
    if(setData) {
      setData(value)
    }

    setSelectedSubLabel(null)
    setSelectedSubValue(null)
  }

  useEffect(() => {
    const valueSelected = options.filter((option: Options) => option.value === value)
    if (valueSelected?.length > 0) {
      setSelectedLabel(valueSelected[0].label)
    }
  }, [value]);

  return (
    <Select onValueChange={handleChangeSelect}
            value={selectedSubValue || value}
            disabled={disabled}
    >
      {label && <div className="mb-2">{label}</div>}
      <SelectTrigger className="w-full !h-[46px] bg-white">
        <SelectValue placeholder={placeholder}>
          {selectedSubLabel || selectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="p-2">
        {
          options.map((option, index) => (
            <div key={index}>
              <div className="flex items-center cursor-pointer">
                {
                  option.subOptions && option.subOptions.length > 0 ?
                    expandIndex === index
                      ? <FontAwesomeIcon icon={faChevronDown}
                                         color="#57595B"
                                         onClick={() => setExpandIndex(-1)}/>
                      : <FontAwesomeIcon icon={faChevronUp}
                                         color="#57595B"
                                         onClick={() => setExpandIndex(index)}/>
                    : ''
                }

                <SelectItem value={option.value} className="cursor-pointer mb-1">
                  {option.label}
                </SelectItem>
              </div>

              {
                option.subOptions
                && option.subOptions.length > 0
                && <div className={cn('py-1 px-8 block', expandIndex !== index && 'hidden')}>
                  <InputRadio options={option.subOptions}
                              value={value}
                              setData={(v: string) => handleChangeSubValue(v, option.subOptions)}/>
                </div>
              }
            </div>
          ))
        }
      </SelectContent>
    </Select>
  )
}

export default InputSelect;