import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // profile form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    industryType: "",
    establishedYear: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data.user);
        setForm({
          name: res.data.user.name || "",
          phone: res.data.user.phone || "",
          location: res.data.user.location || "",
          industryType: res.data.user.industryType || "",
          establishedYear: res.data.user.establishedYear || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setMessage("");
    setError("");

    try {
      const res = await api.put("/users/me", form);
      setUser(res.data.user);
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    try {
      await api.put("/users/update-password", passwordForm);
      setPasswordMessage("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Password update failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Poppins']">Loading profile...</p>
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
              Profile Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage your account information</p>
          </div>

          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-md">
                👤
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-black">Personal & Company Information</h2>
                <p className="text-sm text-gray-500">Update your profile details</p>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <p className="text-emerald-600 text-sm flex items-center gap-2">
                  <span>✓</span> {message}
                </p>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Industry Type</label>
                <input
                  name="industryType"
                  value={form.industryType}
                  onChange={handleChange}
                  placeholder="Coal Mining"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm">Established Year</label>
                <input
                  name="establishedYear"
                  value={form.establishedYear}
                  onChange={handleChange}
                  placeholder="2000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="sm:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </motion.div>

          {/* Password Change Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-2xl shadow-md">
                🔐
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-black">Security Settings</h2>
                <p className="text-sm text-gray-500">Update your password</p>
              </div>
            </div>

            {passwordMessage && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <p className="text-emerald-600 text-sm flex items-center gap-2">
                  <span>✓</span> {passwordMessage}
                </p>
              </motion.div>
            )}
            {passwordError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {passwordError}
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>

              <button
                onClick={handleUpdatePassword}
                className="sm:col-span-2 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;