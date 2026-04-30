import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", icon: "📊", label: "Overview" },
  { to: "/admin/panics", icon: "🚨", label: "Panic Alerts" },
  { to: "/admin/incidents", icon: "📋", label: "Incidents" },
  { to: "/admin/alerts", icon: "📢", label: "Campus Alerts" },
  { to: "/admin/riskzones", icon: "🤖", label: "ML Risk Zones" },
  { to: "/admin/users", icon: "👥", label: "Users" },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-col fixed h-full hidden md:flex">
        <div className="relative h-32 overflow-hidden">
          <img src="/images/campus-gate-2.jpg" alt="PLASU" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center p-4 gap-3">
            <img src="/images/plasu-logo.png" alt="PLASU Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shrink-0" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">PLASU SafeApp</p>
              <p className="text-gray-300 text-xs capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }>
              <span>{icon}</span><span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 z-40 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/plasu-logo.png" alt="PLASU" className="w-7 h-7 object-contain rounded-full bg-white p-0.5" />
          <p className="text-white font-bold text-sm">Admin Portal</p>
        </div>
        <button onClick={handleLogout} className="text-gray-400 text-sm">Logout</button>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 z-40 flex justify-around py-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg text-xs ${
                isActive ? "text-red-400 font-bold" : "text-gray-500"
              }`
            }>
            <span className="text-base">{icon}</span>
            <span className="text-[9px]">{label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
};
export default AdminLayout;
