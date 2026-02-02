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
    return <p className="text-sm text-gray-500">No emission data available.</p>;
  }

  // Group emissions by category
  const grouped = breakdown.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.co2e;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const dataValues = Object.values(grouped);

  const colors = {
  "Fugitive Methane": "#dc2626",
  "Combustion & Chemicals": "#f59e0b",
  "Purchased Electricity": "#2563eb",
};

const data = {
  labels,
  datasets: [
    {
      label: "CO₂e (tons)",
      data: dataValues,
      backgroundColor: labels.map(
        label => colors[label] || "#6b7280"
      ),
      borderWidth: 1,
    },
  ],
};


  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={data} />
    </div>
  );
};

export default MineSourceChart;
