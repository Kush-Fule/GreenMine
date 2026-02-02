import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const MineDetail = () => {
  const { mineId } = useParams();

  const [mine, setMine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    scope1: {
      methane: {
        airFlowRate: "",
        ch4Concentration: "",
        operatingHours: "",
      },
      combustion: {
        dieselLitres: "",
        stationaryFuel: "",
        explosivesKg: "",
      },
    },
    scope2: {
      gridElectricity: "",
      renewableOffset: "",
    },
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

  const handleChange = (scope, section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        [section]: {
          ...prev[scope][section],
          [field]: value,
        },
      },
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");
    setCalculating(true);

    try {
      const res = await api.post(`/mines/${mineId}/calculate`, {
        scope1: {
          methane: {
            airFlowRate: Number(form.scope1.methane.airFlowRate),
            ch4Concentration: Number(form.scope1.methane.ch4Concentration),
            operatingHours: Number(form.scope1.methane.operatingHours),
          },
          combustion: {
            dieselLitres: Number(form.scope1.combustion.dieselLitres),
            stationaryFuel: Number(form.scope1.combustion.stationaryFuel),
            explosivesKg: Number(form.scope1.combustion.explosivesKg),
          },
        },
        scope2: {
          gridElectricity: Number(form.scope2.gridElectricity),
          renewableOffset: Number(form.scope2.renewableOffset),
        },
      });

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

        {/* Calculation Form */}
        <form
          onSubmit={handleCalculate}
          className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 font-semibold">
            Scope 1 – Fugitive Methane
          </h2>

          <input
            placeholder="Air Flow Rate (m³/s)"
            onChange={(e) =>
              handleChange("scope1", "methane", "airFlowRate", e.target.value)
            }
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="CH₄ Concentration (%)"
            onChange={(e) =>
              handleChange(
                "scope1",
                "methane",
                "ch4Concentration",
                e.target.value,
              )
            }
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Operating Hours"
            onChange={(e) =>
              handleChange(
                "scope1",
                "methane",
                "operatingHours",
                e.target.value,
              )
            }
            className="border px-3 py-2 rounded"
            required
          />

          <h2 className="col-span-2 font-semibold mt-4">
            Scope 1 – Combustion & Chemicals
          </h2>

          <input
            placeholder="Diesel Used (litres)"
            onChange={(e) =>
              handleChange(
                "scope1",
                "combustion",
                "dieselLitres",
                e.target.value,
              )
            }
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Stationary Fuel (litres)"
            onChange={(e) =>
              handleChange(
                "scope1",
                "combustion",
                "stationaryFuel",
                e.target.value,
              )
            }
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Explosives Used (kg)"
            onChange={(e) =>
              handleChange(
                "scope1",
                "combustion",
                "explosivesKg",
                e.target.value,
              )
            }
            className="border px-3 py-2 rounded"
            required
          />

          <h2 className="col-span-2 font-semibold mt-4">
            Scope 2 – Purchased Electricity
          </h2>

          <input
            placeholder="Grid Electricity (kWh)"
            onChange={(e) =>
              handleChange("scope2", null, "gridElectricity", e.target.value)
            }
            className="border px-3 py-2 rounded"
            required
          />

          <input
            placeholder="Renewable Offset (kWh)"
            onChange={(e) =>
              handleChange("scope2", null, "renewableOffset", e.target.value)
            }
            className="border px-3 py-2 rounded"
          />
<h2 className="col-span-2 font-semibold mt-6 text-gray-700">
  Operational & Environmental Metadata (Reference Only)
</h2>

<p className="col-span-2 text-xs text-gray-500 mb-2">
  The following parameters are collected for regulatory reference and future
  analytical integration. These values do not affect the current emission
  calculation.
</p>
<input
  placeholder="ROM Coal Production (tonnes / month)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Overburden / Waste Removed (m³)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Average Seam Thickness (meters)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Strip Ratio"
  className="border px-3 py-2 rounded"
/>
<input
  placeholder="Average Ambient Temperature (°C)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Average Wind Speed (m/s)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Annual Rainfall (mm)"
  className="border px-3 py-2 rounded"
/>

<select className="border px-3 py-2 rounded">
  <option>Dust Suppression Method</option>
  <option>Water Sprinkling</option>
  <option>Fog Cannons</option>
  <option>Chemical Binding</option>
</select>
<input
  placeholder="Land Area Disturbed (hectares)"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Land Area Reclaimed (hectares)"
  className="border px-3 py-2 rounded"
/>

<select className="border px-3 py-2 rounded">
  <option>Vegetation Type (Pre-clearing)</option>
  <option>Forest</option>
  <option>Grassland</option>
  <option>Agricultural</option>
</select>

<select className="border px-3 py-2 rounded">
  <option>Reclamation Status</option>
  <option>Planned</option>
  <option>Ongoing</option>
  <option>Completed</option>
</select>
<input
  placeholder="Mine License / Lease Number"
  className="border px-3 py-2 rounded"
/>

<input
  placeholder="Reporting Period (e.g., Jan–Mar 2026)"
  className="border px-3 py-2 rounded"
/>

<select className="border px-3 py-2 rounded">
  <option>Monitoring Frequency</option>
  <option>Daily</option>
  <option>Weekly</option>
  <option>Monthly</option>
</select>

<select className="border px-3 py-2 rounded">
  <option>Data Verification Status</option>
  <option>Self-Reported</option>
  <option>Internally Audited</option>
  <option>Third-Party Verified</option>
</select>

          <button
            type="submit"
            disabled={calculating}
            className="col-span-2 mt-4 bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            {calculating ? "Calculating..." : "Calculate Carbon Footprint"}
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
