import React, {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {useAppSelector} from "@/app/redux/hook";
import {Selection} from "@/app/components/form/Selection";
import {Options, RenewableSource, RequestServiceDetail, WorkOrderObj} from "@/types";


interface EnergyRequirementProps {
  data: WorkOrderObj;
  onUpdate?: (d: WorkOrderObj) => void;
  options: Options[]
}

const EnergyRequirement: React.FC<EnergyRequirementProps> = ({
                                                               data,
                                                               onUpdate,
                                                               options
                                                             }) => {
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [energyOptions, setEnergyOptions] = useState<Options[]>(options);

  useEffect(() => {
    let requestService = data.requestServiceDetail as RequestServiceDetail
    if(typeof data.requestServiceDetail === "string") {
      requestService = JSON.parse(data.requestServiceDetail);
    }
    setSelectedSurvey(requestService?.renewable_source_id || "")
  }, [data]);

  useEffect(() => {
    setEnergyOptions(options);
  }, [options]);

  const handleSurveyChange = (value: string, item: RenewableSource) => {
    let newData = data;

    newData = {
      ...newData,
      requestServiceDetail: {
        ...newData.requestServiceDetail as RequestServiceDetail,
        renewable_source_id: value
      }
    }

    setSelectedSurvey(value);
    onUpdate?.(newData)
  };

  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
      <div className="space-y-4">
        {/* สำรวจความต้องการใช้พลังงานสะอาด */}
        <div className="space-y-2">
          <Label htmlFor="survey-requirement"
                 className="font-medium text-[16px] mb-3"
          >
            สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
          </Label>

          <Selection value={selectedSurvey}
                     options={energyOptions}
                     placeholder={"ต้องการสำรวจพลังงานแสงอาทิตย์"}
                     onUpdate={handleSurveyChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EnergyRequirement;
