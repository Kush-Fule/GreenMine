import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const MineSourceChart = ({ breakdown }) => {
  const data = {
    labels: [
      "Diesel",
      "Electricity",
      "Methane",
      "Transport",
      "Explosives",
    ],
    datasets: [
      {
        label: "CO₂e Contribution (tons)",
        data: [
          breakdown.diesel,
          breakdown.electricity,
          breakdown.methane,
          breakdown.transport,
          breakdown.explosives,
        ],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default MineSourceChart;
