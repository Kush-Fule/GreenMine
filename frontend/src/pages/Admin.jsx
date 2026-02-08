import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import AdminEmissionChart from "../components/AdminEmissionChart";

const AdminDashboard = () => {
  const [corps, setCorps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCorporations = async () => {
    try {
      const res = await api.get("/admin/users");
      setCorps(res.data.users);
    } catch (err) {
      console.error("Failed to load corporations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorporations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this corporation and all its mines?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setCorps(corps.filter((c) => c._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const totalEmissions = corps.reduce((sum, corp) => sum + (corp.totalCO2e || 0), 0);
  const avgEmissions = corps.length > 0 ? (totalEmissions / corps.length).toFixed(2) : 0;
  const greenCount = corps.filter(c => c.emissionLevel === "Green").length;
  const yellowCount = corps.filter(c => c.emissionLevel === "Yellow").length;
  const redCount = corps.filter(c => c.emissionLevel === "Red").length;

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
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black font-['Playfair_Display'] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Monitor all corporations and their emission levels</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading corporations...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl shadow-md">
                      🏢
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Corporations</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{corps.length}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-md">
                      🌍
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Emissions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{totalEmissions.toFixed(2)} t</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-md">
                      📊
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Avg Emissions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{avgEmissions} t</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-md">
                      🎯
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Emission Levels</p>
                  <div className="flex gap-2 text-sm sm:text-base font-bold">
                    <span className="text-green-600">{greenCount}G</span>
                    <span className="text-yellow-600">{yellowCount}Y</span>
                    <span className="text-red-600">{redCount}R</span>
                  </div>
                </motion.div>
              </div>

              {/* Chart */}
              {corps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 lg:mb-8"
                >
                  <AdminEmissionChart users={corps} />
                </motion.div>
              )}

              {/* Corporations Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-black font-['Playfair_Display']">
                    All Corporations ({corps.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Company</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Emissions (CO₂e)</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Level</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corps.map((corp, index) => (
                        <motion.tr
                          key={corp._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {corp.companyName?.charAt(0).toUpperCase() || "C"}
                              </div>
                              <span className="font-semibold text-gray-800">{corp.companyName}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{corp.email}</td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-emerald-600">{corp.totalCO2e || 0}</span>
                            <span className="text-gray-500 text-sm ml-1">tons</span>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                                corp.emissionLevel === "Green"
                                  ? "bg-green-100 text-green-700 border border-green-300"
                                  : corp.emissionLevel === "Yellow"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                  : "bg-red-100 text-red-700 border border-red-300"
                              }`}
                            >
                              {corp.emissionLevel === "Green" ? "✅" : corp.emissionLevel === "Yellow" ? "⚠️" : "🔴"}{" "}
                              {corp.emissionLevel || "N/A"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDelete(corp._id)}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium border border-red-200 hover:border-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {corps.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Corporations Yet</h3>
                    <p className="text-gray-600">Corporations will appear here once they register</p>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;