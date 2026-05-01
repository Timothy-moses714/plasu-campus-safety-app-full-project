import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/alerts/PanicButton";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import AlertBanner from "../components/alerts/AlertBanner";
import Profile from "../pages/Profile";
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

      {/* Hero Banner */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src="/images/senate-building.jpg"
          alt="PLASU Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-900 bg-opacity-60 flex items-center px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/images/plasu-logo.png" alt="PLASU Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full bg-white p-1" />
            <div>
              <p className="text-white font-bold text-sm sm:text-base">Welcome, {user?.name?.split(" ")[0]} 👋</p>
              <p className="text-red-200 text-xs sm:text-sm">Stay safe on campus</p>
              <p className="text-red-300 text-xs">{user?.department} • {user?.matricNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-5 space-y-5 max-w-2xl mx-auto">
        {/* Panic Button */}
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 flex flex-col items-center">
          <p className="text-gray-600 text-xs sm:text-sm font-medium mb-4 text-center">
            🚨 Emergency? Press the panic button — security will be notified instantly with your location
          </p>
          <PanicButton />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {quickLinks.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className="bg-white rounded-xl shadow p-3 sm:p-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-red-50 transition active:scale-95">
              <span className="text-2xl sm:text-3xl">{icon}</span>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Campus image + Safety tip */}
        <div className="relative rounded-2xl overflow-hidden shadow">
          <img src="/images/campus-building.jpg" alt="PLASU Campus"
            className="w-full h-32 sm:h-40 object-cover" />
          <div className="absolute inset-0 bg-red-900 bg-opacity-70 flex flex-col justify-center px-4">
            <p className="text-white text-xs sm:text-sm font-bold mb-1">⚠ Safety Reminder</p>
            <p className="text-red-100 text-[11px] sm:text-xs">
              Always use designated safe routes at night. Report any suspicious activity immediately.
            </p>
          </div>
        </div>

        {/* Security Contact */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <img src="/images/security-desk.jpg" alt="Security Desk"
            className="w-full h-28 sm:h-36 object-cover object-top" />
          <div className="p-4">
            <p className="text-gray-800 font-bold text-sm">🛡 PLASU Security Desk</p>
            <p className="text-gray-500 text-xs mt-1">
              Campus security is available 24/7. Use the panic button for emergencies or report incidents through the app.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default Home;
