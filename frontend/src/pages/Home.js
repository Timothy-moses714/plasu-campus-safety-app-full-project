import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/alerts/PanicButton";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import AlertBanner from "../components/alerts/AlertBanner";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/route-planner", icon: "🗺", label: "Safe Routes" },
  { to: "/report", icon: "📋", label: "Report" },
  { to: "/notifications", icon: "🔔", label: "Alerts" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const EMERGENCY_CONTACTS = [
  { name: "PLASU Security", number: "07012345678", icon: "🛡", color: "bg-red-50 border-red-200" },
  { name: "University Clinic", number: "07098765432", icon: "🏥", color: "bg-blue-50 border-blue-200" },
  { name: "Nigeria Police", number: "112", icon: "👮", color: "bg-yellow-50 border-yellow-200" },
  { name: "Fire Service", number: "08039774488", icon: "🚒", color: "bg-orange-50 border-orange-200" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AlertBanner />
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <img src="/images/senate-building.jpg" alt="PLASU Campus" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-transparent opacity-85 flex items-center px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/images/plasu-logo.png" alt="PLASU Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full bg-white bg-opacity-20 p-1 border-2 border-white border-opacity-30" />
            <div>
              <p className="text-white font-bold text-sm sm:text-base">Welcome, {user?.name?.split(" ")[0]} 👋</p>
              <p className="text-red-200 text-xs sm:text-sm">Stay safe on campus</p>
              <p className="text-red-300 text-xs">{user?.department} • {user?.matricNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4 max-w-2xl mx-auto">

        {/* Panic Button */}
        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 flex flex-col items-center">
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-4 text-center">
            🚨 In an emergency, press the panic button — security will be notified instantly with your GPS location
          </p>
          <PanicButton />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {quickLinks.map(({ to, icon, label }) => (
            <Link key={to} to={to}
              className="bg-white rounded-xl shadow p-2 sm:p-3 flex flex-col items-center gap-1 hover:bg-red-50 transition active:scale-95">
              <span className="text-xl sm:text-2xl">{icon}</span>
              <span className="text-[9px] sm:text-xs font-semibold text-gray-700 text-center">{label}</span>
            </Link>
          ))}
        </div>

        {/* Safety Reminder */}
        <div className="relative rounded-2xl overflow-hidden shadow">
          <img src="/images/campus-building.jpg" alt="PLASU Campus" className="w-full h-28 sm:h-36 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-transparent opacity-85 flex flex-col justify-center px-4">
            <p className="text-white text-xs sm:text-sm font-bold mb-1">⚠ Safety Reminder</p>
            <p className="text-red-100 text-[11px] sm:text-xs max-w-xs">
              Always use designated safe routes at night. Report any suspicious activity immediately using the app.
            </p>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow p-4">
          <p className="text-gray-800 font-bold text-sm mb-3">📞 Emergency Contacts</p>
          <div className="grid grid-cols-2 gap-2">
            {EMERGENCY_CONTACTS.map(({ name, number, icon, color }) => (
              <a key={name} href={`tel:${number}`}
                className={`border rounded-xl p-3 flex items-center gap-2 hover:opacity-80 transition active:scale-95 ${color}`}>
                <span className="text-xl shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="text-gray-700 font-semibold text-xs truncate">{name}</p>
                  <p className="text-gray-500 text-xs">{number}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">Tap any contact to call directly</p>
        </div>

        {/* Security Desk */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <img src="/images/security-desk.jpg" alt="Security Desk" className="w-full h-24 sm:h-32 object-cover object-top" />
          <div className="p-3 sm:p-4">
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
