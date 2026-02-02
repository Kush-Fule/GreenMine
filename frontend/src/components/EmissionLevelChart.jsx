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
        data: [
          levels.Green,
          levels.Yellow,
          levels.Red,
        ],
        backgroundColor: [
          "#16a34a",
          "#eab308",
          "#dc2626",
        ],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default EmissionLevelChart;
