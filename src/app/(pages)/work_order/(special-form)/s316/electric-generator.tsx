import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy, faSignOut} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {ElectricGeneratorObj, S316GeneratorServiceData, S316ServiceData, WorkOrderObj} from "@/types";
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

const TextCopyToClipboard = ({text}: { text: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      await showSuccess('คัดลอกแล้ว')
    } catch (err) {
      console.error("คัดลอกไม่สำเร็จ:", err);
    }
  }

  return (
    <div className="border-1 rounded-md p-2 flex justify-between items-center mt-2">
      {text}

      <Button
        className="bg-[#671FAB] hover:bg-[#671FAB] cursor-pointer border-[#671FAB] rounded-full text-[14px] h-[28px]"
        onClick={() => handleCopy()}>
        <FontAwesomeIcon icon={faCopy}/>
        <div>คัดลอก</div>
      </Button>
    </div>
  )
}

type ElectricGeneratorPlace = {
  peaName: string;
  distance: string;
}

const ElectricGeneratorPlace: React.FC<ElectricGeneratorPlace> = ({
                                                                    peaName,
                                                                    distance,
                                                                  }) => {
  const handleSelect = () => {

  }

  return (
    <div className="border-1 p-2 mt-2 flex justify-between items-center rounded-md">
      <div>{peaName}</div>
      <div className="text-[#671FAB] text-[12px]">ระยะทาง : {distance}</div>
      <Button
        className="bg-[#671FAB] hover:bg-[#671FAB] cursor-pointer border-[#671FAB] rounded-full text-[14px] h-[28px]"
        onClick={() => handleSelect()}>
        <FontAwesomeIcon icon={faSignOut}/>
        <div>เลือก</div>
      </Button>
    </div>
  )
}

const ElectricGenerator = ({
                             data,
                             updateData,
                           }: ElectricGeneratorProps) => {
  const [electricGenerate, setElectricGenerate] = useState<S316ServiceData>({} as S316ServiceData)
  const initDate: DateRange = {
    from: undefined,
    to: undefined
  }
  const [date, setDate] = useState<DateRange | undefined>(initDate)

  useEffect(() => {
    let serviceSpecData = data.serviceSpecificData as S316ServiceData
    setElectricGenerate(serviceSpecData || {} as S316ServiceData)
  }, [data.serviceSpecificData]);

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
            <InputDateRange setData={setDate}
                            data={date}
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
            <ElectricGeneratorPlace peaName="กฟฟ.สามพราน" distance={"20 กม."}/>
          </div>

          <div className="w-full mb-3">
            <div>เครื่อง 300kW : รายการที่ 2</div>
            <ElectricGeneratorPlace peaName="กฟฟ.สามพราน" distance={"20 กม."}/>
          </div>

          <div className="w-full mb-3">
            <div>เครื่อง 500kW : รายการที่ 3</div>
            <ElectricGeneratorPlace peaName="กฟฟ.สามพราน" distance={"20 กม."}/>
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
