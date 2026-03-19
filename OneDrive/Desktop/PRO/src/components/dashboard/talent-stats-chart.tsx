"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function TalentStatsChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 15, 0.95)',
        padding: 12,
        titleFont: { size: 14, family: 'sans-serif' },
        bodyFont: { size: 13, family: 'sans-serif' },
        cornerRadius: 8,
        displayColors: false,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#888',
        }
      },
      y: {
        grid: {
          color: 'rgba(100,100,100,0.1)',
        },
        ticks: {
          color: '#888',
          maxTicksLimit: 6,
        },
        border: { display: false }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Profile Views',
        data: [42, 59, 45, 81, 76, 110, 140],
        borderColor: '#0047AB',
        backgroundColor: 'rgba(0, 71, 171, 0.08)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        fill: true,
        label: 'Profile Saves',
        data: [20, 30, 25, 40, 35, 60, 85],
        borderColor: '#2E8B57',
        backgroundColor: 'rgba(46, 139, 87, 0.08)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full h-full min-h-[250px]">
      <Line options={options} data={data} />
    </div>
  );
}
