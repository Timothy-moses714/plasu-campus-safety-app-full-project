import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/alerts/PanicButton";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import AlertBanner from "../components/alerts/AlertBanner";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/route-planner", icon: "🗺", label: "Safe Routes" },
  { to: "/report", icon: "📋", label: "Report Incident" },
  { to: "/notifications", icon: "🔔", label: "Alerts" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AlertBanner />
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 space-y-5 sm:space-y-6 max-w-2xl mx-auto">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Stay safe on campus. Help is one tap away.
          </p>
        </div>

        {/* Panic Button */}
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 flex flex-col items-center">
          <PanicButton />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {quickLinks.map(({ to, icon, label }) => (
            <Link
              key={to} to={to}
              className="bg-white rounded-xl shadow p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-red-50 transition active:scale-95"
            >
              <span className="text-2xl sm:text-3xl">{icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Safety tip */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-red-700 mb-1">⚠ Safety Reminder</p>
          <p className="text-[11px] sm:text-xs text-red-600">
            Always use designated safe routes at night. Report any suspicious activity immediately.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default Home;
