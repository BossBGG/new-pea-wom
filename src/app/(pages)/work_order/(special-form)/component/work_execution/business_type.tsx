import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Options, BusinessTypeObj} from "@/types";
import {Selection} from "@/app/components/form/Selection";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";

interface BusinessTypeProps {
  value: string;
  onChange?: (value: BusinessTypeObj) => void;
  survey?: boolean;
  businessOptions: Options[],
  onUpdateOptions?: (opts: Options[]) => void;
}

const BusinessType: React.FC<BusinessTypeProps> = ({
                                                     value,
                                                     onChange,
                                                     survey = true,
                                                     businessOptions,
                                                     onUpdateOptions
                                                   }) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleUpdate = (value: string, item: BusinessTypeObj) => {
    setSelectedValue(value);
    onChange?.(item);
  };

  return (
    <>
      {survey && (
        <div>
          <div className="space-y-2">
            <Label
              htmlFor="business-type"
              className="font-medium text-[16px]"
            >
              ประเภทธุรกิจ
            </Label>
            <Selection value={selectedValue}
                       options={businessOptions}
                       placeholder={"เลือกประเภทธุรกิจ"}
                       onSearch={handleSearchBusinessType}
                       onUpdate={handleUpdate}
                       onUpdateOptions={onUpdateOptions}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessType;
