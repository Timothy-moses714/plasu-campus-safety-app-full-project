import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/admin/panics", icon: "🚨", label: "Panic Alerts" },
  { to: "/admin/incidents", icon: "📋", label: "Incidents" },
  { to: "/admin/alerts", icon: "📢", label: "Send Alert" },
  { to: "/admin/users", icon: "👥", label: "Users" },
];

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span>🛡</span>
          <span className="hidden sm:inline">PLASU SafeApp</span>
          <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full ml-1">{user?.role?.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:inline">{user?.name}</span>
          <button onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition">
            Logout
          </button>
        </div>
      </div>

      {/* Side nav - desktop */}
      <div className="hidden md:flex flex-col fixed top-14 left-0 h-full w-56 bg-gray-800 border-r border-gray-700 pt-4 z-40">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }>
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom nav - mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex justify-around py-2 z-50">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                isActive ? "text-red-400 font-bold" : "text-gray-500"
              }`
            }>
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};
export default AdminNavbar;
