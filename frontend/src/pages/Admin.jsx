import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const AdminDashboard = () => {
  const [corps, setCorps] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchCorporations = async () => {
  try {
    const res = await api.get("/admin/users");
    setCorps(res.data.users); // ✅ correct key
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

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-red-700 mb-6">
          Admin Dashboard
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3">Emissions (CO₂e)</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {corps.map((corp) => (
                  <tr key={corp._id} className="border-t">
                    <td className="p-3">{corp.companyName}</td>
                    <td className="p-3">{corp.email}</td>
                    <td className="p-3 text-center">
                      {corp.totalCO2e}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${
                        corp.emissionLevel === "Green"
                          ? "text-green-600"
                          : corp.emissionLevel === "Yellow"
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      {corp.emissionLevel}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(corp._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
