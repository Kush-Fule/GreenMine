import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const Mines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [form, setForm] = useState({
    mineName: "",
    location: "",
    mineType: "Opencast",
    coalType: "",
  });

  const fetchMines = async () => {
    try {
      const res = await api.get(`/mines/${user.id}`);
      setMines(res.data.mines);
    } catch (error) {
      console.error("Failed to fetch mines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMines();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMine = async (e) => {
    e.preventDefault();

    try {
      await api.post("/mines", {
        ...form,
        corpId: user.id,
      });

      setForm({
        mineName: "",
        location: "",
        mineType: "Opencast",
        coalType: "",
      });

      fetchMines();
    } catch (error) {
      alert("Failed to add mine");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mine?")) return;

    try {
      await api.delete(`/mines/${id}`);
      setMines(mines.filter((m) => m._id !== id));
    } catch (error) {
      alert("Failed to delete mine");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-['Poppins']">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
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
              My Mines
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your coal mining operations</p>
          </div>

          {/* Add Mine Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddMine}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 mb-6 lg:mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-md">
                ➕
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-black">Add New Mine</h2>
                <p className="text-sm text-gray-500">Register a new mining site</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Mine Name</label>
                <input
                  name="mineName"
                  placeholder="e.g., North Valley Mine"
                  value={form.mineName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Location</label>
                <input
                  name="location"
                  placeholder="e.g., Wyoming, USA"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Mine Type</label>
                <select
                  name="mineType"
                  value={form.mineType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                >
                  <option>Opencast</option>
                  <option>Underground</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Coal Type</label>
                <input
                  name="coalType"
                  placeholder="e.g., Bituminous"
                  value={form.coalType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Add Mine
              </button>
            </div>
          </motion.form>

          {/* Mine List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading mines...</p>
              </div>
            </div>
          ) : mines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center"
            >
              <div className="text-6xl mb-4">⛏️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Mines Yet</h3>
              <p className="text-gray-600">Add your first mine using the form above</p>
            </motion.div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black font-['Playfair_Display']">
                  All Mines ({mines.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {mines.map((mine, index) => (
                  <motion.div
                    key={mine._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/mines/${mine._id}`)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                          ⛏️
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-black group-hover:text-emerald-600 transition">
                            {mine.mineName}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {mine.location} • {mine.mineType}
                          </p>
                          {mine.coalType && (
                            <p className="text-xs text-gray-400 mt-1">Coal: {mine.coalType}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(mine._id);
                        }}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium border border-red-200 hover:border-red-300 self-start sm:self-center"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mines;