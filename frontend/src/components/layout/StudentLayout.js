import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertBanner from "../alerts/AlertBanner";
import { getAlerts } from "../../services/alertService";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/route-planner", label: "Safe Routes", icon: "🗺" },
  { to: "/report", label: "Report Incident", icon: "📋" },
  { to: "/my-incidents", label: "My Reports", icon: "📄" },
  { to: "/notifications", label: "Alerts", icon: "🔔", hasBadge: true },
  { to: "/about", label: "About", icon: "ℹ️" },
  { to: "/profile", label: "My Profile", icon: "👤" },
];

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!user?.token) return;
    const fetchAlerts = async () => {
      try {
        const res = await getAlerts(user.token);
        const data = res.data || res;
        setAlertCount(Array.isArray(data) ? data.length : 0);
      } catch { setAlertCount(0); }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertBanner />

      {/* ── DESKTOP: sidebar + content side by side ── */}
      <div className="hidden md:flex min-h-screen">

        {/* Sidebar — fixed width, sticky */}
        <aside className="w-64 bg-gray-900 flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
          <div className="relative h-36 overflow-hidden shrink-0">
            <img src="/images/campus-main.jpg" alt="PLASU" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-90" />
            <div className="absolute bottom-0 left-0 p-4 flex items-center gap-3">
              <img src="/images/plasu-logo.png" alt="PLASU"
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border-2 border-red-500 shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">PLASU SafeApp</p>
                <p className="text-gray-400 text-xs">Campus Safety</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-red-600 shrink-0 flex items-center justify-center border-2 border-red-500">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  : <span className="text-white font-bold text-sm">{user?.name?.[0]}</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.matricNumber}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ to, icon, label, hasBadge }) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }>
                <span className="text-lg">{icon}</span>
                <span className="flex-1">{label}</span>
                {hasBadge && alertCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800 shrink-0">
            <button onClick={handleLogout} 
            className="text-gray-400 text-sm">Logout
            </button>
            
          </div>
        </aside>

        {/* Main content — takes remaining width, scrolls independently */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ── MOBILE: top bar + content + bottom nav ── */}
      <div className="md:hidden">
        {/* Fixed top bar */}
        <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/plasu-logo.png" alt="PLASU" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
            <p className="text-white font-bold text-sm">PLASU SafeApp</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs opacity-70">{user?.name?.split(" ")[0]}</span>
            <button onClick={handleLogout} className="text-gray-100 text-xs border border-gray-700 px-2 py-1 rounded-lg">
              Logout
            </button>
          </div>
        </div>

        {/* Content — padded top and bottom to clear fixed bars */}
        <div className="pt-14 pb-16">
          {children}
        </div>

        {/* Fixed bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40 flex justify-around py-1">
          {navItems.slice(0, 5).map(({ to, icon, label, hasBadge }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition ${
                  isActive ? "text-red-400 font-bold" : "text-gray-500"
                }`
              }>
              <div className="relative">
                <span className="text-xl">{icon}</span>
                {hasBadge && alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </div>
              <span className="text-[9px]">{label.split(" ")[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default StudentLayout;
