import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const corpLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/mines", label: "Mines" },
    { path: "/profile", label: "Profile" }
  ];

  const adminLinks = [
    { path: "/admin", label: "Admin Dashboard" },
    { path: "/admin/reports", label: "Reports" }
  ];

  const links = user?.role === "admin" ? adminLinks : corpLinks;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col font-['Poppins'] shadow-2xl h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold font-['Playfair_Display'] bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          GreenMine
        </h2>
        <p className="text-gray-400 text-sm mt-1">{user?.role === "admin" ? "Admin Panel" : "Corporation"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 flex-1 px-6">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`
              w-full text-left px-4 py-3 rounded-lg transition-all duration-300
              ${isActive(link.path)
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-6 pt-4 border-t border-gray-700">
        <div className="mb-4 px-4 py-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold text-white truncate">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300 font-medium border border-red-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;