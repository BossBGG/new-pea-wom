import InputGroup from "@/app/components/form/InputGroup";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

type InputSearchProps = {
  value: string;
  handleSearch: (search: string) => void;
  setValue: (value: string) => void;
  placeholder?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
                                                   value,
                                                   handleSearch,
                                                   setValue,
                                                   placeholder
} : InputSearchProps) => {
  return (
    <InputGroup
      icon={faSearch}
      placeholder={placeholder || "ค้นหา"}
      setData={handleSearch}
      value={value}
      setValue={setValue}
    />
  )
}

export default InputSearch;
