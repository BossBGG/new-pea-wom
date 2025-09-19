import React, {useEffect, useState} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {useAppSelector} from "@/app/redux/hook";
import BusinessType from "@/app/(pages)/work_order/(special-form)/component/work_execution/business_type";
import {BusinessTypeObj, Options, RequestServiceDetail, TransFormerVoltage} from "@/types";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";
import {Selection} from "@/app/components/form/Selection";

interface VoltageLevelProps {
  survey?: boolean;
  businessTypeOptions: Options[];
  voltagesOptions: Options[];
  onUpdateBusinessTypeOptions: (opts: Options[]) => void,
  data: RequestServiceDetail,
  onUpdateData: (d: RequestServiceDetail) => void,
}

const VoltageLevel: React.FC<VoltageLevelProps> = ({
                                                     survey = true,
                                                     businessTypeOptions,
                                                     voltagesOptions,
                                                     onUpdateBusinessTypeOptions,
                                                     data,
                                                     onUpdateData
                                                   }) => {
  const [requestServiceData, setRequestServiceData] = useState<RequestServiceDetail>(data);

  useEffect(() => {
    setRequestServiceData(data)
  }, [data]);

  const handleBusinessChange = (value: BusinessTypeObj) => {
    let newData = {
      ...requestServiceData,
      business_type_id: value.id
    }
    setRequestServiceData(newData);
    onUpdateData(newData)
  };

  const handleVoltageChange = (value: string, item: TransFormerVoltage) => {
    let newData = {
      ...requestServiceData,
      transformer_voltage: value
    }
    setRequestServiceData(newData);
    onUpdateData(newData)
  };

  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
      <div className="flex flex-wrap">
        {/* ประเภทธุรกิจ */}
        {survey && (
          <div className="w-full md:w-1/2 px-2">
            <BusinessType onChange={handleBusinessChange}
                          value={requestServiceData?.business_type_id || ''}
                          onUpdateOptions={onUpdateBusinessTypeOptions}
                          businessOptions={businessTypeOptions}
            />
          </div>
        )}

        {/* ระดับแรงดันไฟฟ้า */}
        <div className="space-y-2 w-full md:w-1/2 px-2 mt-3 md:mt-0">
          <Label htmlFor="voltage-level"
                 className="font-medium text-[16px]"
          >
            ระดับแรงดันไฟฟ้า
          </Label>

          <Selection value={requestServiceData?.transformer_voltage || ''}
                     options={voltagesOptions}
                     placeholder={"เลือกระดับแรงดันไฟฟ้า"}
                     onUpdate={handleVoltageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VoltageLevel;
