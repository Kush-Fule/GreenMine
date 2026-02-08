import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/admin/reports");
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await api.delete(`/admin/reports/${reportId}`);
      setReports(reports.filter((r) => r._id !== reportId));
    } catch (err) {
      alert("Failed to delete report");
    }
  };

  const handleDownload = async (report) => {
    try {
      const res = await api.get(
        `/admin/reports/${report._id}/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.mineId.mineName}_report.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report");
    }
  };

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
              Emission Reports
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">View and manage all generated carbon footprint reports</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reports...</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center"
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Available</h3>
              <p className="text-gray-600">Reports will appear here once corporations generate them</p>
            </motion.div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xl shadow-md">
                      📊
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Reports</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{reports.length}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-md">
                      🏢
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Active Corporations</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                    {new Set(reports.map(r => r.corpId._id)).size}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl shadow-md">
                      ⛏️
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">Monitored Mines</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {new Set(reports.map(r => r.mineId._id)).size}
                  </p>
                </motion.div>
              </div>

              {/* Reports Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-black font-['Playfair_Display']">
                    All Reports ({reports.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Company</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">Mine</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Generated At</th>
                        <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report, index) => (
                        <motion.tr
                          key={report._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {report.corpId.companyName?.charAt(0).toUpperCase() || "C"}
                              </div>
                              <span className="font-semibold text-gray-800">{report.corpId.companyName}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">⛏️</span>
                              <span className="text-gray-700 font-medium">{report.mineId.mineName}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center text-gray-600 text-sm">
                            {new Date(report.generatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDownload(report)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
                              >
                                📥 Download
                              </button>
                              <button
                                onClick={() => handleDelete(report._id)}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium border border-red-200 hover:border-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;