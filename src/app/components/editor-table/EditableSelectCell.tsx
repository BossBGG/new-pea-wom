"use client";
import InputSelect from "@/app/components/form/InputSelect";
import { useEffect, useState } from "react";
import { Options } from "@/types";

interface EditableSelectCellProps {
  columnValue: string;
  row: {
    index: number;
  };
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
  onUpdate?: (value: string) => void;
}

export const EditableSelectCell = ({
  columnValue,
  row,
  column,
  table,
  options,
  placeholder,
  onUpdate,
}: EditableSelectCellProps) => {
  const initialValue = columnValue;
  const [value, setValue] = useState(initialValue);

  function handleChange(value: string) {
    setValue(value);
    table.options.meta?.updateData(row.index, column.id, value);
    if (onUpdate) {
      onUpdate(value);
    }
  }

  useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <InputSelect
      options={options}
      value={value}
      placeholder={placeholder}
      setData={handleChange}
    />
  );
};
