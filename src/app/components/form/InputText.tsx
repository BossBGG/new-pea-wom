import {Input} from "@/components/ui/input";
import {ChangeEvent} from "react";

interface InputTextProps {
  label?: string,
  isRequired?: boolean,
  placeholder?: string,
  value: string | number,
  numberOnly?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
  align?: 'left' | 'center' | 'right'
  maxLength?: number,
  type?: 'text' | 'password' | 'email'
}

const InputText = ({
                     label,
                     isRequired = false,
                     placeholder,
                     value,
                     numberOnly = false,
                     onChange,
                     disabled = false,
                     align='left',
                     maxLength=255,
                     type='text',
                   }: InputTextProps) => {

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return
    const inputValue = e.target.value;
    if(numberOnly) {
      // /^\d*(\.\d{0,2})?$/ สำหรับทศนิยม 2 ตน.
      if(/^\d*$/.test(inputValue)) {
        onChange(inputValue);
      }
    }else {
      onChange(inputValue);
    }
  }

  return (
    <div className="w-full">
      <div className={!label ? 'hidden' : 'text-[#111928] mb-3'}>
        {label}
        <span className={!isRequired ? 'hidden' : 'text-red-500 ml-1'}>*</span>
      </div>

      <Input type={type}
             placeholder={placeholder}
             className={`h-[44px] bg-white text-${align}`}
             value={value || ''}
             onChange={handleChangeValue}
             disabled={disabled}
             maxLength={maxLength}
      />
    </div>
  )
}

export default InputText;
