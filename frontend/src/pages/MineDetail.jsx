import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MineSourceChart from "../components/MineSourceChart";
import api from "../api/axios";

const MineDetail = () => {
  const { mineId } = useParams();
  const navigate = useNavigate();

  const [mine, setMine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    metadata: {
      romCoalProduction: "",
      overburdenRemoved: "",
      seamThickness: "",
      stripRatio: "",
      ambientTemp: "",
      windSpeed: "",
      annualRainfall: "",
      dustSuppression: "Water Sprinkling",
      landDisturbed: "",
      landReclaimed: "",
      vegetationType: "Forest",
      reclamationStatus: "Planned",
      licenseLease: "",
      reportingPeriod: "",
      monitoringFreq: "Monthly",
      verificationStatus: "Self-Reported",
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
  if (scope === "metadata") {
    setForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [section]: value,
      },
    }));
  } else if (scope === "scope2") {
    // Fix for Scope 2
    setForm((prev) => ({
      ...prev,
      scope2: {
        ...prev.scope2,
        [section]: value,
      },
    }));
  } else {
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
  }
};

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCalculating(true);

    try {
      await api.post(`/mines/${mineId}/calculate`, {
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

      setSuccess("Carbon footprint calculated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      fetchMine();
    } catch (err) {
      setError("Calculation failed. Please check inputs.");
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const res = await api.post(`/mines/${mineId}/report`, form, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${mine.mineName}_carbon_report.pdf`;
      a.click();
    } catch (err) {
      alert("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Poppins']">Loading mine details...</p>
        </div>
      </div>
    );
  }

  if (!mine) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['Poppins']">Mine Not Found</h2>
          <button
            onClick={() => navigate("/mines")}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-['Poppins']"
          >
            Back to Mines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-['Poppins']">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-xl font-bold font-['Playfair_Display'] bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            GreenMine
          </h2>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header with Back Button */}
          <div className="mb-6 lg:mb-8">
            <button
              onClick={() => navigate("/mines")}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-4 transition font-medium"
            >
              <span>←</span> Back to Mines
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-black font-['Playfair_Display'] mb-2">
              {mine.mineName}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Comprehensive carbon footprint analysis and reporting</p>
          </div>

          {/* Mine Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-500 text-sm mb-1">Location</p>
              <p className="text-lg font-bold text-gray-800">📍 {mine.location}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-500 text-sm mb-1">Mine Type</p>
              <p className="text-lg font-bold text-gray-800">{mine.mineType}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-500 text-sm mb-1">Coal Type</p>
              <p className="text-lg font-bold text-gray-800">{mine.coalType}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-500 text-sm mb-1">Last Calculated</p>
              <p className="text-sm font-semibold text-gray-800">
                {mine.calculatedAt
                  ? new Date(mine.calculatedAt).toLocaleDateString()
                  : "Not yet"}
              </p>
            </motion.div>
          </div>

          {/* Emission Results & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-8 rounded-xl shadow-lg border-2 border-emerald-200"
            >
              <h2 className="text-2xl font-bold text-black mb-6 font-['Playfair_Display']">Emission Results</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Total Carbon Footprint</p>
                  <p className="text-5xl font-bold text-emerald-600">{mine.totalCO2e}</p>
                  <p className="text-gray-500 text-sm mt-1">tons CO₂e</p>
                </div>
                <div className="h-px bg-emerald-200"></div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Emission Level Status</p>
                  <span
                    className={`inline-block px-6 py-3 rounded-lg text-xl font-bold ${
                      mine.emissionLevel === "Green"
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : mine.emissionLevel === "Yellow"
                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                        : "bg-red-100 text-red-700 border-2 border-red-300"
                    }`}
                  >
                    {mine.emissionLevel === "Green" ? "✅" : mine.emissionLevel === "Yellow" ? "⚠️" : "🔴"} {mine.emissionLevel}
                  </span>
                </div>
              </div>
            </motion.div>

            {mine.emissionBreakdown && mine.emissionBreakdown.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MineSourceChart breakdown={mine.emissionBreakdown} />
              </motion.div>
            )}
          </div>

          {/* Calculation Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCalculate}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black font-['Playfair_Display']">
                  Carbon Footprint Calculator
                </h2>
                <p className="text-gray-600 text-sm mt-1">Enter operational data for emission calculation</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg hidden sm:flex">
                🧮
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <p className="text-emerald-600 text-sm flex items-center gap-2">
                  <span>✓</span> {success}
                </p>
              </motion.div>
            )}

            {/* Scope 1 - Methane */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💨</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Scope 1 – Fugitive Methane Emissions</h3>
                  <p className="text-sm text-gray-500">Underground methane release and ventilation data</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Air Flow Rate (m³/s)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.scope1.methane.airFlowRate}
                    onChange={(e) => handleChange("scope1", "methane", "airFlowRate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">CH₄ Concentration (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.scope1.methane.ch4Concentration}
                    onChange={(e) => handleChange("scope1", "methane", "ch4Concentration", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Operating Hours</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.scope1.methane.operatingHours}
                    onChange={(e) => handleChange("scope1", "methane", "operatingHours", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Scope 1 - Combustion */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔥</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Scope 1 – Combustion & Chemicals</h3>
                  <p className="text-sm text-gray-500">Fuel consumption and explosive usage</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Diesel Used (litres)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.scope1.combustion.dieselLitres}
                    onChange={(e) => handleChange("scope1", "combustion", "dieselLitres", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Stationary Fuel (litres)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.scope1.combustion.stationaryFuel}
                    onChange={(e) => handleChange("scope1", "combustion", "stationaryFuel", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Explosives Used (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.scope1.combustion.explosivesKg}
                    onChange={(e) => handleChange("scope1", "combustion", "explosivesKg", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

           {/* Scope 2 */}
<div className="mb-8 pb-8 border-b border-gray-200">
  <div className="flex items-center gap-3 mb-6">
    <span className="text-3xl">⚡</span>
    <div>
      <h3 className="text-xl font-bold text-gray-800">Scope 2 – Purchased Electricity</h3>
      <p className="text-sm text-gray-500">Grid electricity consumption and renewable offsets</p>
    </div>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2">Grid Electricity (kWh)</label>
      <input
        type="number"
        step="0.01"
        placeholder="0.00"
        value={form.scope2.gridElectricity}
        onChange={(e) => handleChange("scope2", "gridElectricity", null, e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        required
      />
    </div>
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-2">Renewable Offset (kWh)</label>
      <input
        type="number"
        step="0.01"
        placeholder="0.00"
        value={form.scope2.renewableOffset}
        onChange={(e) => handleChange("scope2", "renewableOffset", null, e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
      />
    </div>
  </div>
</div>
            {/* Metadata Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl mb-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📋</span>
                  <h3 className="text-xl font-bold text-gray-800">Operational & Environmental Metadata</h3>
                </div>
                <p className="text-sm text-gray-600 ml-12">
                  Reference data for regulatory compliance and future analytical integration. These values do not affect current emission calculations.
                </p>
              </div>

              {/* Production Data */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>⛏️</span> Production Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">ROM Coal Production (tonnes/month)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.romCoalProduction}
                      onChange={(e) => handleChange("metadata", "romCoalProduction", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Overburden Removed (m³)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.overburdenRemoved}
                      onChange={(e) => handleChange("metadata", "overburdenRemoved", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Avg Seam Thickness (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.seamThickness}
                      onChange={(e) => handleChange("metadata", "seamThickness", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Strip Ratio</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.stripRatio}
                      onChange={(e) => handleChange("metadata", "stripRatio", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>🌤️</span> Environmental Conditions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Avg Ambient Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={form.metadata.ambientTemp}
                      onChange={(e) => handleChange("metadata", "ambientTemp", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Avg Wind Speed (m/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={form.metadata.windSpeed}
                      onChange={(e) => handleChange("metadata", "windSpeed", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Annual Rainfall (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={form.metadata.annualRainfall}
                      onChange={(e) => handleChange("metadata", "annualRainfall", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Dust Suppression Method</label>
                    <select
                      value={form.metadata.dustSuppression}
                      onChange={(e) => handleChange("metadata", "dustSuppression", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                      <option>Water Sprinkling</option>
                      <option>Fog Cannons</option>
                      <option>Chemical Binding</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Land Management */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>🌳</span> Land Management & Reclamation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Land Disturbed (hectares)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.landDisturbed}
                      onChange={(e) => handleChange("metadata", "landDisturbed", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Land Reclaimed (hectares)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.metadata.landReclaimed}
                      onChange={(e) => handleChange("metadata", "landReclaimed", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Vegetation Type (Pre-clearing)</label>
                    <select
                      value={form.metadata.vegetationType}
                      onChange={(e) => handleChange("metadata", "vegetationType", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                      <option>Forest</option>
                      <option>Grassland</option>
                      <option>Agricultural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Reclamation Status</label>
                    <select
                      value={form.metadata.reclamationStatus}
                      onChange={(e) => handleChange("metadata", "reclamationStatus", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                      <option>Planned</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Regulatory & Compliance */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <span>📄</span> Regulatory & Compliance Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Mine License/Lease Number</label>
                    <input
                      type="text"
                      placeholder="e.g., ML-2024-001"
                      value={form.metadata.licenseLease}
                      onChange={(e) => handleChange("metadata", "licenseLease", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Reporting Period</label>
                    <input
                      type="text"
                      placeholder="e.g., Jan–Mar 2026"
                      value={form.metadata.reportingPeriod}
                      onChange={(e) => handleChange("metadata", "reportingPeriod", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Monitoring Frequency</label>
                    <select
                      value={form.metadata.monitoringFreq}
                      onChange={(e) => handleChange("metadata", "monitoringFreq", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs font-medium mb-2">Data Verification Status</label>
                    <select
                      value={form.metadata.verificationStatus}
                      onChange={(e) => handleChange("metadata", "verificationStatus", null, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                    >
                      <option>Self-Reported</option>
                      <option>Internally Audited</option>
                      <option>Third-Party Verified</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={calculating}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              >
                {calculating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Calculating...
                  </span>
                ) : (
                  "🧮 Calculate Carbon Footprint"
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg text-base sm:text-lg"
              >
                📄 Download PDF Report
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
};

export default MineDetail;