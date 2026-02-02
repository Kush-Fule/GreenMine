import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // =========================
  // Fetch profile
  // =========================
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

  // =========================
  // Handlers
  // =========================
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
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Password update failed"
      );
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* ================= PROFILE INFO ================= */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Personal & Company Information
          </h2>

          {message && (
            <p className="text-green-600 mb-3">{message}</p>
          )}
          {error && (
            <p className="text-red-600 mb-3">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 rounded"
            />

            <input
              name="industryType"
              value={form.industryType}
              onChange={handleChange}
              placeholder="Industry Type"
              className="border p-2 rounded"
            />

            <input
              name="establishedYear"
              value={form.establishedYear}
              onChange={handleChange}
              placeholder="Established Year"
              className="border p-2 rounded"
            />

            <button
              onClick={handleSaveProfile}
              className="col-span-2 bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ================= PASSWORD CHANGE ================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Change Password
          </h2>

          {passwordMessage && (
            <p className="text-green-600 mb-3">
              {passwordMessage}
            </p>
          )}
          {passwordError && (
            <p className="text-red-600 mb-3">
              {passwordError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="border p-2 rounded"
            />

            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="border p-2 rounded"
            />

            <button
              onClick={handleUpdatePassword}
              className="col-span-2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
