import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAlerts, createAlert } from "../../services/alertService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const AdminSendAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ message: "", severity: "info" });
  const { user } = useAuth();

  useEffect(() => {
    getAlerts(user.token)
      .then((data) => setAlerts(Array.isArray(data) ? data : data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.token]);

  const handleSend = async () => {
    if (!form.message) return alert("Please enter a message.");
    setSending(true);
    try {
      const newAlert = await createAlert(form, user.token);
      setAlerts((prev) => [newAlert.data || newAlert, ...prev]);
      setForm({ message: "", severity: "info" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to send alert.");
    } finally {
      setSending(false);
    }
  };

  const severityColors = {
    info: "bg-blue-900 text-blue-300 border-blue-700",
    warning: "bg-yellow-900 text-yellow-300 border-yellow-700",
    critical: "bg-red-900 text-red-300 border-red-700",
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">📢 Send Campus Alert</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast alerts to all students</p>
        </div>

        {/* Send form */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
            <select value={form.severity} onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Warning</option>
              <option value="critical">🚨 Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              rows={3} placeholder="Type your alert message here..."
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
          {success && (
            <div className="bg-green-900 border border-green-700 text-green-300 text-sm p-3 rounded-lg">
              ✅ Alert sent successfully to all students!
            </div>
          )}
          <Button onClick={handleSend} fullWidth disabled={sending}>
            {sending ? <Spinner size="sm" color="white" /> : "📢 Send Alert"}
          </Button>
        </div>

        {/* Previous alerts */}
        <div>
          <h2 className="text-white font-semibold mb-3">Previous Alerts</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : alerts.length === 0 ? (
            <p className="text-gray-400 text-sm">No alerts sent yet.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert._id}
                  className={`border rounded-xl p-4 ${severityColors[alert.severity] || severityColors.info}`}>
                  <p className="font-semibold text-sm">{alert.message}</p>
                  <p className="text-xs opacity-70 mt-1">{timeAgo(alert.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminSendAlert;
