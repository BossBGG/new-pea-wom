'use client'
import {Checkbox} from "@/components/ui/checkbox";
import {Options} from "@/types";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

interface InputCheckBoxProps {
  options: Options[],
  label?: string,
  className?: string,
  classNameItem?: string,
  setData: (value: string[]) => void,
  value: string[]
}

const InputCheckbox = ({
                         options,
                         label,
                         className,
                         classNameItem,
                         setData,
                         value
                       }:
                       InputCheckBoxProps
) => {

  const [expandIndex, setExpandIndex] = useState(-1);
  const handleCheckedChange = (checked: boolean, v: string) => {
    if (checked) {
      setData([...value, v])
    } else {
      setData(value.filter((item) => item !== v))
    }
  }

  return (
    <div className={className && className}>
      {label && <div className="mb-3">{label}</div>}
      {
        options && options.length > 0 &&
        options.map((option, index) => (
          <div key={index} className={classNameItem && classNameItem}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox id={option.value}
                          className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer"
                          onCheckedChange={(checked: boolean) => {handleCheckedChange(checked, option.value)}}
                />
                <Label className="cursor-pointer" htmlFor={option.value}>{option.label}</Label>
                {
                  option.subOptions && option.subOptions.length > 0 &&
                  <div className="text-[#671FAB]">
                    ( {option.subOptions.filter((sub) => value.includes(sub.value)).length} / {option.subOptions.length})
                  </div>
                }
              </div>

              {
                option.subOptions && options.length > 0
                  ? expandIndex === index
                    ? <FontAwesomeIcon icon={faChevronDown} className="cursor-pointer" onClick={() => setExpandIndex(-1)} />
                    : <FontAwesomeIcon icon={faChevronUp} className="cursor-pointer" onClick={() => setExpandIndex(index)} />
                  : ''
              }
            </div>

            {
              option.subOptions && option.subOptions.length > 0 &&
              expandIndex === index &&
              <InputCheckbox options={option.subOptions}
                             key={`${option.value}_${index}`}
                             classNameItem="pl-6"
                             className="bg-[#F2F2F2] p-2"
                             setData={setData}
                             value={value}
              />
            }
          </div>
        ))
      }
    </div>
  )
}

export default InputCheckbox;
