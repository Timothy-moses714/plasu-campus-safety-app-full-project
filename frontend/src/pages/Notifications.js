import { useState, useEffect } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import { getAlerts } from "../services/alertService";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/formatDate";
import Spinner from "../components/common/Spinner";

const severityStyles = {
  critical: "bg-red-50 border-red-300 text-red-700",
  warning:  "bg-yellow-50 border-yellow-300 text-yellow-700",
  info:     "bg-blue-50 border-blue-300 text-blue-700",
};
const severityIcons = { critical: "🚨", warning: "⚠️", info: "ℹ️" };

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await getAlerts(user.token);
        const data = res.data || res;
        setAlerts(Array.isArray(data) ? data : []);
      } catch { setAlerts([]); }
      finally { setLoading(false); }
    };
    if (user?.token) fetchAlerts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">🔔 Alerts & Notifications</h2>
          <p className="text-gray-500 text-xs mt-1">Stay informed about campus safety</p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center"><Spinner /></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <p className="text-5xl mb-3">✅</p>
            <p className="text-gray-600 font-semibold">No alerts at the moment</p>
            <p className="text-gray-400 text-sm mt-1">Stay safe on campus!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert._id || alert.id}
                className={`border rounded-2xl p-4 ${severityStyles[alert.severity] || severityStyles.info}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{severityIcons[alert.severity] || "ℹ️"}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{alert.message}</p>
                    <p className="text-xs opacity-70 mt-1">{timeAgo(alert.issuedAt || alert.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
export default Notifications;
