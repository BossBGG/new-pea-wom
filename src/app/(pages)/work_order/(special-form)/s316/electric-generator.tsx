import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import {ElectricGeneratorObj, WorkOrderObj} from "@/types";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import InputDateRange from "@/app/components/form/InputDateRange";
import {DateRange} from "react-day-picker";
import {showSuccess} from "@/app/helpers/Alert";
import {Button} from "@/components/ui/button";
import {InputTimeRange} from "@/app/components/form/InputTimeRange";

interface ElectricGeneratorProps {
  data: WorkOrderObj;
  updateData: (data: WorkOrderObj) => void;
}
const TextCopyToClipboard = ({text}: {text: string}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      await showSuccess('คัดลอกแล้ว')
    } catch (err) {
      console.error("คัดลอกไม่สำเร็จ:", err);
    }
  }

  return (
    <div className="border-1 rounded-md p-2 flex justify-between items-center mt-3">
      {text}

      <Button className="bg-[#671FAB] border-[#671FAB] rounded-full"
              onClick={() => handleCopy()}>
        <FontAwesomeIcon icon={faCopy} />
        <div>คัดลอก</div>
      </Button>
    </div>
  )
}

const ElectricGenerator = ({
                             data,
                             updateData,
                           }: ElectricGeneratorProps) => {
  const [electricGenerate, setElectricGenerate] = useState<ElectricGeneratorObj>({} as ElectricGeneratorObj)

  const handleDateChange = (key: string, value: DateRange | undefined) => {
    setElectricGenerate(prevState => ({
      ...prevState,
      [key]: value
    }))
  }

  return (
    <CardCollapse title={'เครื่องกำเนิดไฟฟ้า'}>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 px-3">
          <div className="w-full mb-3">
            <InputDateRange setData={(v) => handleDateChange('repeat_start_date',v)}
                            data={{
                              from: electricGenerate.repeat_start_date,
                              to: electricGenerate.repeat_end_date,
                            }}
                            label="วันที่ขอรับบริการ"
            />
          </div>
          <div className="w-full">
            <div className="mb-3">ประมาณเวลาที่เริ่มต้น-สิ้นสุดที่ต้องการใช้งาน</div>
            <InputTimeRange/>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-3">
          <div className="w-full mb-3">
            <div>เครื่อง 300kW : รายการที่ 1</div>
          </div>

          <div className="w-full mb-3">
            <div>เครื่อง 300kW : รายการที่ 1</div>
          </div>

          <div className="w-full mb-3">
            <div>เครื่อง 500kW : รายการที่ 1</div>
          </div>
        </div>

        <div className="w-full md:w-1/3 px-3">
          <div className="w-full mb-3">
            <div>เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง</div>
            <TextCopyToClipboard text="02-683-1129"/>
          </div>
          <div className="w-full mb-3">
            <div>เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง</div>
            <TextCopyToClipboard text="02-683-1129"/>
          </div>
          <div className="w-full mb-3">
            <div>เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง</div>
            <TextCopyToClipboard text="02-683-1129"/>
          </div>
        </div>
      </div>
    </CardCollapse>
  )
}

export default ElectricGenerator;
