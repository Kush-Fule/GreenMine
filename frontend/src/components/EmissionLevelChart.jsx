import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EmissionLevelChart = ({ mines }) => {
  const levels = { Green: 0, Yellow: 0, Red: 0 };

  mines.forEach((m) => {
    if (levels[m.emissionLevel] !== undefined) {
      levels[m.emissionLevel]++;
    }
  });

  const data = {
    labels: ["Green", "Yellow", "Red"],
    datasets: [
      {
        data: [levels.Green, levels.Yellow, levels.Red],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 500,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 14,
          weight: 600,
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13,
        },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} mines (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins']">
        Emission Levels Distribution
      </h3>
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default EmissionLevelChart;