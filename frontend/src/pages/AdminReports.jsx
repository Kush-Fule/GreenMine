import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch all reports on page load
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

  // 2️⃣ Delete report (admin only)
  const handleDelete = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      await api.delete(`/admin/reports/${reportId}`);
      setReports(reports.filter((r) => r._id !== reportId));
    } catch (err) {
      alert("Failed to delete report");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-red-700">
          Emission Reports
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : reports.length === 0 ? (
          <p>No reports available</p>
        ) : (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Mine</th>
                  <th className="p-3">Generated At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="border-t">
                    <td className="p-3">{report.corpId.companyName}</td>

                    <td className="p-3">{report.mineId.mineName}</td>

                    <td className="p-3 text-center">
                      {new Date(report.generatedAt).toLocaleString()}
                    </td>

                    <td className="p-3 text-center space-x-3">
                      {/* 🔽 DOWNLOAD PDF */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await api.get(
                              `/admin/reports/${report._id}/download`,
                              { responseType: "blob" },
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
                        }}
                        className="text-blue-600 underline"
                      >
                        Download
                      </button>

                      {/* ❌ DELETE REPORT */}
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="text-red-600 underline"
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

export default AdminReports;
