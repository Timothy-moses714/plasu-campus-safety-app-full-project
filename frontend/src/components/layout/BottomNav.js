import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/route-planner", label: "Routes", icon: "🗺" },
  { to: "/report", label: "Report", icon: "📋" },
  { to: "/notifications", label: "Alerts", icon: "🔔" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around py-1 z-40 md:hidden">
    {navItems.map(({ to, label, icon }) => (
      <NavLink key={to} to={to} end={to === "/"}
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition ${
            isActive ? "text-red-400 font-bold" : "text-gray-500"
          }`
        }>
        <span className="text-xl">{icon}</span>
        <span className="text-[10px]">{label}</span>
      </NavLink>
    ))}
  </nav>
);
export default BottomNav;
