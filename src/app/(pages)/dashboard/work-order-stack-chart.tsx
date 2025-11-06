import React from 'react';
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
import {MonthlyData} from "@/types";

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
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const transformDataForChart = (data: MonthlyData[]) => {
  return {
    labels: data.map(item => item.monthName),
    datasets: [
      {
        label: 'ดำเนินงานเสร็จสิ้น',
        data: data.map(item => item.completed),
        backgroundColor: "#9538EA"
      },
      {
        label: 'ใบสั่งงานทั้งหมด',
        data: data.map(item => item.created),
        backgroundColor: "#D9A6FA"
      }
    ]
  };
};

interface WorkOrderStackChartProps {
  data: MonthlyData[]
}

export function WorkOrderStackChart({
                                      data
                                    }: WorkOrderStackChartProps) {
  const chartData = transformDataForChart(data);
  
  return <Card className="p-3">
    <div className="text-semibold">รายการทั้งหมด</div>
    <Bar options={options} data={chartData}/>
  </Card>
}
