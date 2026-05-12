import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertBanner from "../alerts/AlertBanner";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/route-planner", label: "Safe Routes", icon: "🗺" },
  { to: "/report", label: "Report Incident", icon: "📋" },
  { to: "/notifications", label: "Alerts", icon: "🔔" },
  { to: "/profile", label: "My Profile", icon: "👤" },
];

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AlertBanner />

      {/* Sidebar - desktop */}
      <aside className="w-64 bg-gray-900 flex-col fixed h-full hidden md:flex z-30">
        {/* Header with campus image */}
        <div className="relative h-36 overflow-hidden shrink-0">
          <img src="/images/campus-gate.jpg" alt="PLASU" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-90" />
          <div className="absolute bottom-0 left-0 p-4 flex items-center gap-3">
            <img src="/images/plasu-logo.png" alt="PLASU"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border-2 border-red-500 shrink-0" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">PLASU SafeApp</p>
              <p className="text-gray-400 text-xs">Campus Safety</p>
            </div>
          </div>
        </div>

        {/* Student info */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-red-600 shrink-0 flex items-center justify-center border-2 border-red-500">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{user?.name?.[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{user?.matricNumber}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }>
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-800 z-40 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/plasu-logo.png" alt="PLASU"
            className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
          <p className="text-white font-bold text-sm">PLASU SafeApp</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
        <span className="opacity-80 hidden sm:inline truncate max-w-[120px] text-xs">{user?.name}</span>
        <button onClick={handleLogout}
          className="bg-white text-red-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-50 transition">
          Logout
        </button>
      </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-40 flex justify-around py-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${
                isActive ? "text-red-400 font-bold" : "text-gray-500"
              }`
            }>
            <span className="text-xl">{icon}</span>
            <span className="text-[9px]">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
};
export default StudentLayout;
