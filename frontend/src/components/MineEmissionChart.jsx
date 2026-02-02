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

import { Bar, Doughnut, Line } from "react-chartjs-2";

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
      },
    ],
  };

 

  const lineData = {
    labels,
    datasets: [
      {
        label: "Emission Pattern",
        data: values,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bar Chart */}
      <div>
        <h3 className="font-semibold mb-2">Mine-wise Emissions</h3>
        <Bar data={barData} />
      </div>

    
      {/* Line Chart */}
      <div className="md:col-span-2">
        <h3 className="font-semibold mb-2">Emission Comparison Trend</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default MineEmissionChart;
