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
import { Bar } from 'react-chartjs-2';
import {addMonths, format} from "date-fns";
import {th} from "date-fns/locale";
import {Card} from "@/components/ui/card";

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

const renderLabels = () => {
  let label: string[] = [];
  let today = new Date();

  for (let i = 0; i < 12; i++) {
    let nextMonth = addMonths(today, i)
    label.push(format(nextMonth, "LLL", { locale: th }))
  }

  return label
}

export const data = {
  labels: renderLabels(),
  datasets: [
    {
      label: 'ดำเนินงานเสร็จสิ้น',
      data: [5, 10, 15, 20, 25, 30, 35],
      backgroundColor: "#9538EA"
    },
    {
      label: 'ใบสั่งงานทั้งหมด',
      data: [10, 20, 30, 40, 50, 60, 70],
      backgroundColor: "#D9A6FA"
    }
  ],
};

export function WorkOrderStackChart() {
  return <Card className="p-3">
    <div className="text-semibold">รายการทั้งหมด</div>
    <Bar options={options} data={data} />
  </Card>
}
