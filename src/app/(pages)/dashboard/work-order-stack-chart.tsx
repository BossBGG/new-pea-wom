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
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: function(context: any) {
          return context[0].label;
        },
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        },
        afterLabel: function(context: any) {
          if (context.datasetIndex === 1) { // แสดงผลรวมเฉพาะที่แท่งสุดท้าย
            const total = context.chart.data.datasets.reduce((sum: number, dataset: any) => {
              return sum + dataset.data[context.dataIndex];
            }, 0);
            return `รวม: ${total}`;
          }
          return '';
        }
      }
    }
  },
  layout: {
    padding: {
      bottom: 50
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  }
};

const transformDataForChart = (data: MonthlyData[]) => {
  return {
    labels: data.map(item => item.monthName),
    datasets: [
      {
        label: 'ดำเนินงานเสร็จสิ้น',
        data: data.map(item => item.completed),
        backgroundColor: "#9538EA",
        borderSkipped: false,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 8,
          bottomRight: 8
        },
        maxBarThickness: 55,
        categoryPercentage: 0.8
      },
      {
        label: 'ใบสั่งงานทั้งหมด',
        data: data.map(item => item.created),
        backgroundColor: "#D9A6FA",
        borderSkipped: false,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 8,
          bottomRight: 8
        },
        maxBarThickness: 55,
        categoryPercentage: 0.8
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

  return <Card className="p-3 w-full h-[400px]">
    <div className="text-semibold">รายการทั้งหมด</div>
    <Bar options={options} data={chartData}/>
  </Card>
}
