import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const MineEmissionChart = ({ mines }) => {
  const labels = mines.map((m) => m.mineName);
  const values = mines.map((m) => m.totalCO2e);

  const barData = {
    labels,
    datasets: [
      {
        label: "CO₂e Emissions (tons)",
        data: values,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(20, 184, 166, 0.9)",
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Emission Pattern",
        data: values,
        tension: 0.4,
        borderColor: "rgba(20, 184, 166, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 600,
          },
          padding: 15,
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          callback: function (value) {
            return value.toLocaleString() + " t";
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins']">
          Mine-wise Emissions
        </h3>
        <div className="h-72">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins']">
          Emission Comparison Trend
        </h3>
        <div className="h-72">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MineEmissionChart;