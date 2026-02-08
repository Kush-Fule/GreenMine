import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import MineEmissionChart from "../components/MineEmissionChart";
import EmissionLevelChart from "../components/EmissionLevelChart";

const Dashboard = () => {
  const { user } = useAuth();
  const [corp, setCorp] = useState(null);
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/corp/${user.id}`);
        setCorp(res.data.corporation);
        setMines(res.data.mines);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAnalytics();
  }, [user]);

  const statCards = [
    {
      label: "Total Emissions (CO₂e)",
      value: `${corp?.totalCO2e || 0} tons`,
      icon: "🌍",
      color: "from-emerald-500 to-teal-600"
    },
    {
      label: "Emission Level",
      value: corp?.emissionLevel || "N/A",
      icon: corp?.emissionLevel === "Green" ? "✅" : corp?.emissionLevel === "Yellow" ? "⚠️" : "🔴",
      color: corp?.emissionLevel === "Green" 
        ? "from-green-500 to-emerald-600" 
        : corp?.emissionLevel === "Yellow" 
        ? "from-yellow-400 to-orange-500" 
        : "from-red-500 to-rose-600",
      textColor: corp?.emissionLevel === "Green"
        ? "text-green-600"
        : corp?.emissionLevel === "Yellow"
        ? "text-yellow-600"
        : "text-red-600"
    },
    {
      label: "Total Mines",
      value: mines.length,
      icon: "⛏️",
      color: "from-blue-500 to-cyan-600"
    },
    {
      label: "Avg Emission / Mine",
      value: `${analytics?.avgEmissionPerMine || 0} tons`,
      icon: "📊",
      color: "from-purple-500 to-pink-600"
    }
  ];

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Sidebar */}
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
        {/* Mobile Header with Menu Button */}
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
              Corporation Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Welcome back, {user?.name}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                {statCards.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-xl sm:text-2xl shadow-md`}>
                        {card.icon}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">{card.label}</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${card.textColor || 'text-gray-800'}`}>
                      {card.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6 font-['Playfair_Display']">
                  Emissions Analytics
                </h2>
                
                <div className="mb-4 sm:mb-6">
                  <MineEmissionChart mines={mines} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <EmissionLevelChart mines={mines} />
                  
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base">
                        Add New Mine
                      </button>
                      <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm sm:text-base">
                        Generate Report
                      </button>
                      <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm sm:text-base">
                        View All Mines
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;