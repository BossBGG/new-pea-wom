import React, {useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {addMonths, format} from "date-fns";
import {th} from "date-fns/locale";
import {Card} from "@/components/ui/card";
import InputSelect from "@/app/components/form/InputSelect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: false
    },
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle"
      }
    }
  },
  responsive: true
};

const renderLabels = () => {
  let label: string[] = [];
  let today = new Date();

  for (let i = 0; i < 12; i++) {
    let nextMonth = addMonths(today, i)
    label.push(format(nextMonth, "LLL", {locale: th}))
  }

  return label
}

export const data = {
  labels: renderLabels(),
  datasets: [
    {
      label: 'พนักงาน PEA',
      data: [580, 586, 650, 280, 200, 150, 180, 350, 580, 720, 810, 380],
      backgroundColor: "#8561FF"
    },
    {
      label: 'ผู้รับจ้าง',
      data: [800, 587, 180, 570, 180, 150, 180, 510, 400, 640, 600],
      backgroundColor: "#E79E9E"
    }
  ],
};

const CardCountHourWorkOrder = ({
                                  label,
                                  count,
                                  bgColor = "#E4DCFF",
                                  iconColor
                                }: {
  label: string,
  count: number,
  bgColor?: string,
  iconColor?: string
}) => {
  return (
    <Card className="px-2 w-full md:w-1/3 shadow-none border-none">
      <Card className="p-3 bg-white shadow-none border-1"
            style={{ backgroundColor: bgColor, borderColor: bgColor }}>
        <div className="flex justify-between">
          <div className="flex items-center">
            {
              iconColor && <FontAwesomeIcon icon={faUser} color={iconColor} size={"2xl"} className="me-3"/>
            }
            <div>
              <div className="font-medium text-[14px] mb-3">{label}</div>
              <div className="text-[12px] font-medium">(ทั้งหมด)</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-[24px] font-bold me-2">{count ? count.toLocaleString() : 0}</div>
            <div className="font-medium text-[14px]">ชม./ปี</div>
          </div>
        </div>
      </Card>
    </Card>
  )
}

export function WorkOrderHourChart() {
  const [hourChartMode, setHourChartMode] = useState("year")

  const handleChangeHourChartMode = (mode: string | number) => {
    setHourChartMode(mode as string)
    //TODO call api fetch list chart data
  }

  return <Card className="p-3 mt-3">
    <div className="flex justify-between">
      <div className="text-semibold">จำนวนชั่วโมงการปฏิบัติงานรวม</div>

      <div>
        <InputSelect options={[
          {value: "year", label: "ปี"},
          {value: "week", label: "สัปดาห์"},
          {value: "month", label: "เดือน"}
        ]}
                     value={hourChartMode}
                     placeholder={""}
                     setData={handleChangeHourChartMode}
                     className="rounded-full text-[#671FAB] cursor-pointer"
        />
      </div>
    </div>

    <div className="flex flex-wrap">
      <CardCountHourWorkOrder label={"พนักงาน PEA"} count={6200} iconColor={"#671FAB"}/>
      <CardCountHourWorkOrder label={"ผู้รับจ้าง"} count={6000} bgColor={"#FFE2E5"} iconColor={"#FF616D"}/>
      <CardCountHourWorkOrder label={"ชั่วโมง"} count={12000} bgColor={"#E8E9F1"}/>
    </div>

    <Bar options={options} data={data}/>
  </Card>
}
