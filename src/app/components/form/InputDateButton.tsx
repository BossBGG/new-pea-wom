import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface InputDateButtonProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const InputDateButton: React.FC<InputDateButtonProps> = ({
 label,
 value,
 onChange,
 placeholder = "Invalid Date",
 disabled = false,
 className
}) => {
 const [open, setOpen] = useState(false);

 return (
   <div className={cn("flex flex-col space-y-2", className)}>
     {label && (
       <label className="font-medium">
         {label}
       </label>
     )}

     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="outline"
           className={cn(
             "w-full justify-start text-left font-normal h-[44px] px-4 border-[#D1D5DB] bg-white",
             !value && "text-muted-foreground",
             disabled && "opacity-50 cursor-not-allowed"
           )}
           disabled={disabled}
         >
           <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4" />
           {value ? (
             format(value, "dd/MM/yyyy", { locale: th })
           ) : (
             <span>{placeholder}</span>
           )}
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-auto p-0" align="start">
         <Calendar
           mode="single"
           selected={value}
           onSelect={(date) => {
             onChange?.(date);
             setOpen(false);
           }}
           disabled={disabled}
           initialFocus
           locale={th}
         />
       </PopoverContent>
     </Popover>
   </div>
 );
};

export default InputDateButton;
