import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import MineEmissionChart from "../components/MineEmissionChart";

const Dashboard = () => {
  const { user } = useAuth();
  const [corp, setCorp] = useState(null);
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/corp/${user.id}`);
        setCorp(res.data.corporation);
        setMines(res.data.mines);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAnalytics();
  }, [user]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          Corporation Dashboard
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
         <>
    {/* Summary Cards */}
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Total Emissions (CO₂e)</p>
        <p className="text-2xl font-bold">
          {corp.totalCO2e} tons
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Emission Level</p>
        <p
          className={`text-2xl font-bold ${
            corp.emissionLevel === "Green"
              ? "text-green-600"
              : corp.emissionLevel === "Yellow"
              ? "text-yellow-500"
              : "text-red-600"
          }`}
        >
          {corp.emissionLevel}
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-gray-500">Total Mines</p>
        <p className="text-2xl font-bold">
          {mines.length}
        </p>
      </div>
    </div>

    {/* Chart */}
    {mines.length > 0 && (
      <div className="bg-white p-6 rounded shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Mine-wise Emissions
        </h2>
        <MineEmissionChart mines={mines} />
      </div>
    )}
  </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
