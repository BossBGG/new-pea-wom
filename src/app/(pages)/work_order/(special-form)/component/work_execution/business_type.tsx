import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Options, BusinessTypeObj, WorkOrderObj, ServiceSpecificData, BusinessTypeOnlyData} from "@/types";
import {Selection} from "@/app/components/form/Selection";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";

interface BusinessTypeProps {
  data: WorkOrderObj;
  updateData?: (d: WorkOrderObj) => void;
  survey?: boolean;
  businessOptions: Options[],
  onUpdateOptions?: (opts: Options[]) => void;
  disabled?: boolean
}

const BusinessType: React.FC<BusinessTypeProps> = ({
                                                     data,
                                                     updateData,
                                                     survey = true,
                                                     businessOptions,
                                                     onUpdateOptions,
                                                     disabled = false
                                                   }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    let serviceSpecData = data.serviceSpecificData as BusinessTypeOnlyData;
    setSelectedValue(serviceSpecData?.businessTypeId)
  }, [data.serviceSpecificData]);

  const handleUpdate = (value: string, item: BusinessTypeObj) => {
    setSelectedValue(value);
    let newData =  {
      ...data,
      serviceSpecificData: {
        ...data.serviceSpecificData,
        businessTypeId: value
      }
    }

    updateData?.(newData);
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
                       disabled={disabled}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessType;
