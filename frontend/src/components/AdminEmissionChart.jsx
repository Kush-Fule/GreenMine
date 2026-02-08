import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const AdminEmissionChart = ({ users }) => {
  const data = {
    labels: users.map((u) => u.companyName),
    datasets: [
      {
        label: "Total CO₂e (tons)",
        data: users.map((u) => u.totalCO2e),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(20, 184, 166, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        labels: {
          color: "#374151",
          font: {
            family: "'Poppins', sans-serif",
            size: 13,
            weight: 600
          },
          padding: 15
        }
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
          weight: 600
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawBorder: false
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString() + ' tons';
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 font-['Poppins']">
        Company Emissions Overview
      </h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AdminEmissionChart;