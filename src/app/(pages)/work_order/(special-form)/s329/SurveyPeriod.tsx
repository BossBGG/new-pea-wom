import React, {useEffect, useState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useAppSelector} from "@/app/redux/hook";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";
import {th} from "date-fns/locale";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {cn} from "@/lib/utils";
import {RequestServiceDetail, WorkOrderObj} from "@/types";
import InputText from "@/app/components/form/InputText";
import InputDateButton from "@/app/components/form/InputDateButton";


interface SurveyPeriodProps {
  data: WorkOrderObj,
  onUpdate?: (d: WorkOrderObj) => void
}

const SurveyPeriod: React.FC<SurveyPeriodProps> = ({
                                                     data,
                                                     onUpdate
                                                   }) => {
  const [selectedYear, setSelectedYear] = useState<Date | undefined>();
  const [period, setPeriod] = useState("");

  useEffect(() => {
    let requestService = data.requestServiceDetail as RequestServiceDetail
    if (typeof data.requestServiceDetail === "string") {
      requestService = JSON.parse(data.requestServiceDetail);
    }
    setSelectedYear(requestService?.year)
    setPeriod(requestService?.num_years as string)
  }, [data]);

  const handleYearChange = (date: Date | undefined) => {
    setSelectedYear(date);
    let workOrder = data;
    workOrder = {
      ...workOrder,
      requestServiceDetail: {
        ...data.requestServiceDetail as RequestServiceDetail,
        year: date,
      }
    }

    onUpdate?.(workOrder);
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    let workOrder = data;
    workOrder = {
      ...workOrder,
      requestServiceDetail: {
        ...data.requestServiceDetail as RequestServiceDetail,
        num_years: value
      }
    }

    onUpdate?.(workOrder);
  };

  // Desktop Layout
  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">
          ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
        </h4>

        <div className="flex flex-wrap">
          {/* เลือกปี */}
          <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
            <InputDateButton label={" ปี พ.ศ."}
                             value={selectedYear}
                             formatDate={"dd MMMM "}
                             displayBuddhistYear={true}
                             onChange={handleYearChange}
            />
          </div>

          {/* จำนวนปี */}
          <div className="w-full md:w-1/2 px-2">
            <InputText value={period}
                       numberOnly={true}
                       onChange={handlePeriodChange}
                       placeholder={"จำนวนปี"}
                       label={"จำนวน (ปี)"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPeriod;
