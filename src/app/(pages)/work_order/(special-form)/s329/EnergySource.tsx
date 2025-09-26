import React, {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {useAppSelector} from "@/app/redux/hook";
import {Options, RenewableType, RequestServiceDetail, WorkOrderObj} from "@/types";
import {Selection} from "@/app/components/form/Selection";


interface EnergySourceProps {
  data: WorkOrderObj;
  options: Options[];
  onUpdate?: (d: WorkOrderObj) => void;
}

const EnergySource: React.FC<EnergySourceProps> = ({
                                                     data,
                                                     options,
                                                     onUpdate
                                                   }: EnergySourceProps) => {
  const [selectedType, setSelectedType] = useState("");
  const [energyOptions, setEnergyOptions] = useState<Options[]>(options);

  useEffect(() => {
    let requestService = data.requestServiceDetail as RequestServiceDetail
    if(typeof data.requestServiceDetail === "string") {
      requestService = JSON.parse(data.requestServiceDetail);
    }
    setSelectedType(requestService?.renewable_type_id || "")
  }, [data]);

  useEffect(() => {
    setEnergyOptions(options);
  }, [options]);

  const handleTypeChange = (value: string, item: RenewableType) => {
    let newData = data;

    newData = {
      ...newData,
      requestServiceDetail: {
        ...newData.requestServiceDetail as RequestServiceDetail,
        renewable_type_id: value
      }
    }

    setSelectedType(value);
    onUpdate?.(newData)
  };

  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="energy-source" className="font-medium text-[16px] mb-3">
          แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ
        </Label>
        <Selection value={selectedType}
                   options={energyOptions}
                   placeholder={"แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ"}
                   onUpdate={handleTypeChange}
        />
      </div>
    </div>
  );

};

export default EnergySource;
