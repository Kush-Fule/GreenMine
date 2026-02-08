import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const MineSourceChart = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
        <p className="text-gray-500 font-['Poppins']">No emission data available.</p>
      </div>
    );
  }

  // Group emissions by category
  const grouped = breakdown.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.co2e;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const dataValues = Object.values(grouped);

  const colors = {
    "Fugitive Methane": "rgba(239, 68, 68, 0.8)",
    "Combustion & Chemicals": "rgba(251, 191, 36, 0.8)",
    "Purchased Electricity": "rgba(59, 130, 246, 0.8)",
  };

  const borderColors = {
    "Fugitive Methane": "rgba(239, 68, 68, 1)",
    "Combustion & Chemicals": "rgba(251, 191, 36, 1)",
    "Purchased Electricity": "rgba(59, 130, 246, 1)",
  };

  const data = {
    labels,
    datasets: [
      {
        label: "CO₂e (tons)",
        data: dataValues,
        backgroundColor: labels.map(
          (label) => colors[label] || "rgba(107, 114, 128, 0.8)"
        ),
        borderColor: labels.map(
          (label) => borderColors[label] || "rgba(107, 114, 128, 1)"
        ),
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
            return `${label}: ${value.toLocaleString()} tons (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins']">
        Emission Sources Breakdown
      </h3>
      <div className="h-80 flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default MineSourceChart;