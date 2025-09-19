import {Input} from "@/components/ui/input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useEffect, useMemo} from "react";
import debounce from "lodash/debounce";

type InputGroupProps = {
  icon: IconProp;
  placeholder: string;
  setData: (value: string) => void;
  setValue: (value: string) => void;
  value: string
}

const InputGroup: React.FC<InputGroupProps> = ({
                                                 icon,
                                                 placeholder,
                                                 setData,
                                                 value,
                                                 setValue
                                               }: InputGroupProps) => {

  const debouncedSearch = useMemo(
    () => debounce(setData, 800), [setData]
  );

  return (
    <div className="flex items-center relative w-full">
      <Input type="text"
             placeholder={placeholder}
             onChange={event => {
               const newValue = event.target.value;
               setValue(newValue);
               debouncedSearch(newValue);
             }}
             value={value}
             className="mr-2 py-[22]"
      />
      <FontAwesomeIcon icon={icon} className="absolute right-[20]" color="#6B7280"/>
    </div>
  )
}

export default InputGroup;
