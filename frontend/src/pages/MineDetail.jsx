import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MineSourceChart from "../components/MineSourceChart";
import api from "../api/axios";

const MineDetail = () => {
  const { mineId } = useParams();

  const [mine, setMine] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    dieselLitres: "",
    electricityKwh: "",
    methaneTons: "",
    coalExtractedTons: "",
    transportDistanceKm: "",
    explosivesKg: "",
    coalGrade: "Medium",
  });

  const fetchMine = async () => {
    try {
      const res = await api.get(`/mines/mine/${mineId}`);
      setMine(res.data.mine);
    } catch (err) {
      console.error("Failed to fetch mine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, [mineId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");
    setCalculating(true);

    try {
      const res = await api.post(`/mines/${mineId}/calculate`, {
        dieselLitres: Number(form.dieselLitres),
        electricityKwh: Number(form.electricityKwh),
        methaneTons: Number(form.methaneTons),
        coalExtractedTons: Number(form.coalExtractedTons),
        transportDistanceKm: Number(form.transportDistanceKm),
        explosivesKg: Number(form.explosivesKg),
        coalGrade: form.coalGrade,
      });

      // capture breakdown for chart
      setBreakdown(res.data.mineEmission.breakdown);

      // refresh mine data
      fetchMine();
    } catch (err) {
      setError("Calculation failed. Please check inputs.");
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!mine) return <p className="p-8">Mine not found</p>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          {mine.mineName}
        </h1>

        {/* Mine Info */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <p>
            <strong>Location:</strong> {mine.location}
          </p>
          <p>
            <strong>Mine Type:</strong> {mine.mineType}
          </p>
          <p>
            <strong>Coal Type:</strong> {mine.coalType}
          </p>
          <p>
            <strong>Last Calculated:</strong>{" "}
            {mine.calculatedAt
              ? new Date(mine.calculatedAt).toLocaleString()
              : "Not calculated yet"}
          </p>
        </div>

        {/* Latest Result */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold mb-2">Latest Emission Result</h2>
          <p>Total CO₂e: {mine.totalCO2e} tons</p>
          <p>Emission Level: {mine.emissionLevel}</p>
        </div>

        {/* Source Breakdown Chart */}
        {breakdown && (
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="font-semibold mb-4">Emission Source Breakdown</h2>
            <MineSourceChart breakdown={breakdown} />
          </div>
        )}

        {/* Calculation Form */}
        <form
          onSubmit={handleCalculate}
          className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 font-semibold mb-2">
            Calculate Carbon Footprint
          </h2>

          {error && <p className="col-span-2 text-red-600 text-sm">{error}</p>}

          <input
            name="dieselLitres"
            placeholder="Diesel (litres)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="electricityKwh"
            placeholder="Electricity (kWh)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="methaneTons"
            placeholder="Methane (tons)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="coalExtractedTons"
            placeholder="Coal Extracted (tons)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="transportDistanceKm"
            placeholder="Transport Distance (km)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="explosivesKg"
            placeholder="Explosives (kg)"
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <select
            name="coalGrade"
            onChange={handleChange}
            className="border px-3 py-2 rounded col-span-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            type="submit"
            disabled={calculating}
            className="col-span-2 bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            {calculating ? "Calculating..." : "Calculate Footprint"}
          </button>
        </form>
        <button
          onClick={async () => {
            const res = await api.post(`/mines/${mineId}/report`, form, {
              responseType: "blob",
            });

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${mine.mineName}_carbon_report.pdf`;
            a.click();
          }}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default MineDetail;
