import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import { getAlerts } from "../services/alertService";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/formatDate";
import Spinner from "../components/common/Spinner";

const severityStyles = {
  critical: "bg-red-50 border-red-300 text-red-700",
  warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
  info: "bg-blue-50 border-blue-300 text-blue-700",
};
const severityIcons = { critical: "🚨", warning: "⚠️", info: "ℹ️" };

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getAlerts(user.token)
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [user.token]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 space-y-3 sm:space-y-4 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">🔔 Alerts & Notifications</h2>
        {loading ? (
          <div className="py-10"><Spinner /></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">✅</p>
            <p className="text-xs sm:text-sm">No alerts at the moment. Stay safe!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-xl p-3 sm:p-4 ${severityStyles[alert.severity] || severityStyles.info}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg sm:text-xl shrink-0">{severityIcons[alert.severity] || "ℹ️"}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm">{alert.message}</p>
                  <p className="text-[10px] sm:text-xs opacity-70 mt-1">{timeAgo(alert.issuedAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};
export default Notifications;
