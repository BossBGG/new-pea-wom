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
import {addDays, format} from "date-fns";
import {th} from "date-fns/locale";

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
  let today = new Date();
  let label: string[] = [format(today, "d EE", {locale: th})];

  for (let i = 1; i < 6; i++) {
    let nextDay = addDays(today, i)
    label.push(format(nextDay, "d EE", { locale: th }))
  }

  return label
}

export const data = {
  labels: renderLabels(),
  datasets: [
    {
      label: 'งานที่ปฏิบัติงาน',
      data: [5, 10, 15, 20, 25, 30, 35],
      backgroundColor: "#9538EA"
    },
    {
      label: 'งานสำรวจ',
      data: [10, 20, 30, 40, 50, 60, 70],
      backgroundColor: "#D9A6FA"
    }
  ],
};

export function WorkOrderChart() {
  return <Bar options={options} data={data} />;
}
