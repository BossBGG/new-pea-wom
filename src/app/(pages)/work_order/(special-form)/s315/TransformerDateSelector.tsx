import React, { useState, useEffect } from 'react';
import InputDateButton from "@/app/components/form/InputDateButton";
import { Label } from "@/components/ui/label";
import {RequestServiceDetail, WorkOrderObj} from "@/types";
import {differenceInDays} from "date-fns";

interface TransformerDateSelectorProps {
  data: WorkOrderObj,
  updateData: (d: WorkOrderObj) => void,
  label?: string
}

const TransformerDateSelector: React.FC<TransformerDateSelectorProps> = ({
  data,
  updateData,
  label
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
  const [totalDays, setTotalDays] = useState<number>(0);

  useEffect(() => {
    let requestService = data.requestServiceDetail as RequestServiceDetail
    let start_date = requestService?.start_date ? new Date(requestService.start_date) : undefined;
    setSelectedStartDate(start_date);
    let end_date = requestService?.end_date ? new Date(requestService.end_date) : undefined;
    setSelectedEndDate(end_date);
    setTotalDays(requestService?.days || 0)
  }, [data.requestServiceDetail]);

  const handleChangeStartDate = (d: Date | undefined) => {
    setSelectedStartDate(d);
    let countDays = differenceInDays(selectedEndDate as Date, d as Date) || 0
    setTimeout(() => {
      handleUpdateData('start_date', d, countDays);
    }, 300)
  }

  const handleChangeEndDate = (d: Date | undefined) => {
    setSelectedEndDate(d)
    let countDays = differenceInDays(d as Date, selectedStartDate as Date) || 0
    setTimeout(() => {
      handleUpdateData('end_date', d, countDays);
    }, 300)
  }

  const handleUpdateData = (key: string, date: Date | undefined, count: number) => {
    let newData = data;

    newData = {
      ...newData,
      requestServiceDetail: {
        ...newData.requestServiceDetail as RequestServiceDetail,
        [key]: date,
        days: count
      }
    }

    updateData(newData);
  }

  return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className='pb-4'>
          { label || "วันที่เช่าหม้อแปลง" }
        </div>
        <div className="flex flex-wrap items-center">
          {/* วันที่เริ่มต้น */}
          <div className="w-full md:w-1/3 mb-3 md:mb-0 px-3">
            <InputDateButton
              label="วันที่เริ่มต้น"
              value={selectedStartDate}
              onChange={handleChangeStartDate}
              placeholder="เลือกวันที่เริ่มต้น"
              className="w-full"
            />
          </div>

          {/* วันที่สิ้นสุด */}
          <div className="w-full md:w-1/3 mb-3 md:mb-0 px-3">
            <InputDateButton
              label="วันที่สิ้นสุด"
              value={selectedEndDate}
              onChange={handleChangeEndDate}
              placeholder="เลือกวันที่สิ้นสุด"
              className="w-full"
            />
          </div>

          {/* จำนวนวัน */}
          <div className="w-full md:w-1/3 px-3">
            <Label className="text-[16px] mb-3">
              จำนวนวัน
            </Label>
            <div className="h-[44px] w-full rounded-md border border-[#D1D5DB] bg-gray-50 px-3 py-2 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                [ {totalDays} วัน ]
              </span>
            </div>
          </div>
        </div>
      </div>

  );
};

export default TransformerDateSelector;
