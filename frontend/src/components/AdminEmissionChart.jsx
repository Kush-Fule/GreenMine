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
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AdminEmissionChart;
