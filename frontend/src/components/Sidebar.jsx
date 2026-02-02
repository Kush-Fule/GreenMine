import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-xl font-bold mb-6">GreenMine</h2>

      <nav className="space-y-4">
        {user?.role === "corp" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="block text-left w-full hover:text-green-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/mines")}
              className="block text-left w-full hover:text-green-400"
            >
              Mines
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="block text-left w-full hover:text-green-400"
            >
              Profile
            </button>
          </>
        )}

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="block text-left w-full hover:text-green-400"
          >
            Admin Dashboard
          </button>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 block text-left w-full text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
