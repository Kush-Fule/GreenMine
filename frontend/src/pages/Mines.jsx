import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const Mines = () => {
  const { user } = useAuth();
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-green-700 mb-6">Mines</h1>

        {/* Add Mine Form */}
        <form
          onSubmit={handleAddMine}
          className="bg-white p-6 rounded shadow mb-8 grid grid-cols-2 gap-4"
        >
          <input
            name="mineName"
            placeholder="Mine Name"
            value={form.mineName}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <select
            name="mineType"
            value={form.mineType}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option>Opencast</option>
            <option>Underground</option>
          </select>

          <input
            name="coalType"
            placeholder="Coal Type"
            value={form.coalType}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="col-span-2 bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Add Mine
          </button>
        </form>

        {/* Mine List */}
        {loading ? (
          <p>Loading...</p>
        ) : mines.length === 0 ? (
          <p className="text-gray-600">No mines added yet.</p>
        ) : (
          <div className="grid gap-4">
            {mines.map((mine) => (
              <div
                key={mine._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => (window.location.href = `/mines/${mine._id}`)}
                >
                  <h3 className="font-semibold">{mine.mineName}</h3>
                  <p className="text-sm text-gray-500">
                    {mine.location} • {mine.mineType}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(mine._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mines;
