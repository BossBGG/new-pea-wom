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
import {MonthlyData, WorkHours} from "@/types";

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
  /*animation: {
    onComplete: function (animation: any) {
      const chart = animation.chart;
      const ctx = chart.ctx;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Arial';

      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        meta.data.forEach((bar: any, index: number) => {
          const data = dataset.data[index];
          if (data > 0) {
            ctx.fillText(data.toLocaleString(), bar.x, bar.y - 5);
          }
        });
      });
    }
  },*/
  responsive: true,
  maintainAspectRatio: false,
};

export const transformDataForChart = (data: MonthlyData[]) => {
  return {
    labels: data.map(item => item.monthName),
    datasets: [
      {
        label: 'พนักงาน PEA',
        data: data.map(item => item.peaEmployeeCount),
        backgroundColor: "#8561FF",
        borderRadius: 12
      },
      {
        label: 'ผู้รับจ้าง',
        data: data.map(item => item.vendorCount),
        backgroundColor: "#E79E9E",
        borderRadius: 12
      }
    ],
  }
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
    <Card className="px-2 w-full md:w-1/3 mb-3 md:mb-0 shadow-none border-none">
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

interface WorkOrderHourChartProps {
  data: WorkHours,
  dataChart: MonthlyData[]
}

export function WorkOrderHourChart({
                                     data,
                                     dataChart
                                   }:WorkOrderHourChartProps) {
  const [hourChartMode, setHourChartMode] = useState("year")
  const chartData = transformDataForChart(dataChart);

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
      <CardCountHourWorkOrder label={"พนักงาน PEA"} count={data?.peaEmployeeHours || 0} iconColor={"#671FAB"}/>
      <CardCountHourWorkOrder label={"ผู้รับจ้าง"} count={data?.vendorHours || 0} bgColor={"#FFE2E5"} iconColor={"#FF616D"}/>
      <CardCountHourWorkOrder label={"ชั่วโมง"} count={data?.totalHours || 0} bgColor={"#E8E9F1"}/>
    </div>

    <div className="w-full h-[400px]">
      <Bar options={options} data={chartData}/>
    </div>
  </Card>
}
