import { useAuth } from "../context/AuthContext";
import PanicButton from "../components/alerts/PanicButton";
import StudentLayout from "../components/layout/StudentLayout";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";


const EMERGENCY_CONTACTS = [
  { name: "PLASU Security", number: "07012345678", icon: "🛡", color: "bg-red-600", textColor: "text-white" },
  { name: "University Clinic", number: "07098765432", icon: "🏥", color: "bg-blue-600", textColor: "text-white" },
  { name: "Nigeria Police", number: "112", icon: "👮", color: "bg-yellow-500", textColor: "text-gray-900" },
  { name: "Fire Service", number: "08039774488", icon: "🚒", color: "bg-orange-500", textColor: "text-white" },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">

        {/* Welcome Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 sm:h-48">
          <img src="/images/senate-building.jpg" alt="PLASU Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-transparent flex items-center px-6">
            <div>
              <p className="text-red-200 text-xs sm:text-sm font-medium">Welcome back 👋</p>
              <p className="text-white font-bold text-xl sm:text-2xl mt-1">{user?.name?.split(" ")[0]}</p>
              <p className="text-red-200 text-xs mt-1">{user?.department}</p>
              <p className="text-red-300 text-xs">{user?.matricNumber}</p>
            </div>
          </div>
        </div>

        {/* Panic Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center border border-red-100">
          <p className="text-gray-600 text-sm font-medium mb-2 text-center">Emergency Panic Button</p>
          <p className="text-gray-400 text-xs text-center mb-6">
            Press in case of emergency — security will be notified instantly with your GPS location
          </p>
          <PanicButton />
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
          <h2 className="text-gray-800 font-bold text-base sm:text-lg mb-4">📞 Emergency Contacts</h2>
          <div className="grid grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS.map(({ name, number, icon, color, textColor }) => (
              <a key={name} href={`tel:${number}`}
                className={`${color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:opacity-90 transition active:scale-95 shadow`}>
                <span className="text-3xl">{icon}</span>
                <p className={`${textColor} font-bold text-xs sm:text-sm text-center leading-tight`}>{name}</p>
                <p className={`${textColor} text-xs opacity-80 font-semibold`}>{number}</p>
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3 text-center">Tap any card to call directly</p>
        </div>

        {/* Safety Reminder - Big Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64">
          <img src="/images/campus-building.jpg" alt="PLASU Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-red-900/70 to-transparent flex flex-col justify-end p-5 sm:p-6">
            <p className="text-white font-bold text-base sm:text-lg mb-2">⚠ Campus Safety Reminder</p>
            <p className="text-red-100 text-xs sm:text-sm leading-relaxed">
              Always use designated safe routes at night. Avoid isolated areas especially the Mini Stadium and Checkpoint areas after 6PM. Report any suspicious activity immediately using the app.
            </p>
            <Link to="/route-planner"
              className="mt-3 inline-block bg-white text-red-700 font-bold text-xs px-4 py-2 rounded-xl hover:bg-red-50 transition w-fit">
              🗺 View Safe Routes
            </Link>
          </div>
        </div>

        {/* Security Desk - Big Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 sm:h-56">
            <img src="/images/security-desk.jpg" alt="Security Desk" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">24/7 Available</span>
            </div>
          </div>
          <div className="p-5">
            <h2 className="text-gray-800 font-bold text-base sm:text-lg">🛡 PLASU Security Desk</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Campus security is available 24 hours a day, 7 days a week. Use the panic button above for immediate emergencies, or report non-urgent incidents through the Report section.
            </p>
            <div className="flex gap-3 mt-4">
              <Link to="/report"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 rounded-xl transition text-center">
                📋 Report Incident
              </Link>
              <a href="tel:07012345678"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-xl transition text-center">
                📞 Call Security
              </a>
            </div>
          </div>
        </div>

      </div>
    </StudentLayout>
  );
};
export default Home;
