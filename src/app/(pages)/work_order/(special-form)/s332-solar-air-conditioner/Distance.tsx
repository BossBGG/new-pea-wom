import React, {useEffect, useState} from 'react';
import {Card} from "@/components/ui/card";
import InputText from "@/app/components/form/InputText";
import {Selection} from "@/app/components/form/Selection";
import {RequestServiceDetail, SiteSurveyAirCondition, WorkOrderObj} from "@/types";

interface DistanceComponentProps {
  data: WorkOrderObj;
  updateData?: (d: WorkOrderObj) => void;
}

const DistanceComponent: React.FC<DistanceComponentProps> = ({
                                                               data,
                                                               updateData,
                                                             }) => {
  const [formData, setFormData] = useState<SiteSurveyAirCondition>({} as SiteSurveyAirCondition);

  useEffect(() => {
    if(typeof data.requestServiceDetail === 'object') {
      setFormData(data.requestServiceDetail as RequestServiceDetail)
    }
  }, [data.requestServiceDetail]);

  const wiringOptions = [
    {value: 'เหนือ', label: 'เหนือ'},
    {value: 'ใต้', label: 'ใต้'},
    {value: 'ตะวันออก', label: 'ตะวันออก'},
    {value: 'ตะวันตก', label: 'ตะวันตก'}
  ];

  const handleChange = (field: keyof SiteSurveyAirCondition, value: string | number) => {
    const newData = {...formData, [field]: value};
    setFormData(newData);

    let newWorkOrderData: WorkOrderObj = {
      ...data,
      requestServiceDetail: {
        ...data.requestServiceDetail as RequestServiceDetail,
        ...newData
      }
    }

    updateData?.(newWorkOrderData);
  };

  return (
    <Card className="p-4 mb-3">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 px-2 mb-3">
          <InputText value={formData.refrigerantPipeDistance}
                     numberOnly={true}
                     onChange={(value: string) => handleChange('refrigerantPipeDistance', parseInt(value) || 0)}
                     label={"ระยะท่อน้ำยาแอร์ (จากคอยล์ร้อนถึงคอยล์เย็น) ประมาณ"}
                     labelUnit={"เมตร"}
                     placeholder={"ระยะท่อน้ำยาแอร์"}
          />
        </div>

        <div className="w-full md:w-1/2 px-2 mb-3">
          <InputText value={formData.dcCableDistance}
                     numberOnly={true}
                     onChange={(value: string) => handleChange('dcCableDistance', parseInt(value) || 0)}
                     label={"ระยะสายไฟ DC (จากแผงโซลาร์เซลล์ถึงคอยส่วยร่อน) ประมาณ"}
                     labelUnit={"เมตร"}
                     placeholder={"ระยะสายไฟ DC"}
          />
        </div>

        <div className="w-full md:w-1/2 px-2 mb-3">
          <InputText value={formData.acCableDistance}
                     numberOnly={true}
                     onChange={(value: string) => handleChange('acCableDistance', parseInt(value) || 0)}
                     label={"ระยะสายไฟ AC (จากตู้ไฟถึงคอยล์ร้อน)"}
                     labelUnit={"เมตร"}
                     placeholder={"ระยะสายไฟ AC"}
          />
        </div>

        <div className="px-2 w-full md:w-1/2">
          <div className="mb-3">
            หน้าบ้านหันทิศ
          </div>
          <Selection value={formData.houseFrontDirection}
                     options={wiringOptions}
                     placeholder={"หน้าบ้านหันทิศ"}
                     onUpdate={(value: string) => handleChange('houseFrontDirection', value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default DistanceComponent;
