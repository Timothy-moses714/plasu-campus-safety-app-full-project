import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAlerts, createAlert, deactivateAlert } from "../../services/alertService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const SEVERITY_COLORS = {
  critical: "bg-red-900 border-red-600 text-red-300",
  warning: "bg-yellow-900 border-yellow-600 text-yellow-300",
  info: "bg-blue-900 border-blue-600 text-blue-300",
};

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ message: "", severity: "info" });
  const { user } = useAuth();

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await getAlerts(user.token);
      const data = res.data || res;
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const handleSend = async () => {
    if (!form.message) return alert("Please enter a message");
    setSending(true);
    try {
      await createAlert(form, user.token);
      setForm({ message: "", severity: "info" });
      fetchAlerts();
    } catch { alert("Failed to send alert"); }
    finally { setSending(false); }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateAlert(id, user.token);
      setAlerts(prev => prev.filter(a => (a._id || a.id) !== id));
    } catch { alert("Failed to deactivate"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">📢 Campus Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast alerts to all students</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-bold">Send New Alert</h2>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Severity</label>
            <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="info">ℹ️ Info</option>
              <option value="warning">⚠️ Warning</option>
              <option value="critical">🚨 Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1">Message</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              rows={3} placeholder="Type your alert message..."
              className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
          <button onClick={handleSend} disabled={sending}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50">
            {sending ? <Spinner size="sm" color="white" /> : "📢 Broadcast Alert"}
          </button>
        </div>

        <div>
          <h2 className="text-white font-bold mb-3">Active Alerts</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner size="lg" color="red" /></div>
          ) : alerts.length === 0 ? (
            <p className="text-gray-500 text-sm">No active alerts</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert._id || alert.id} className={`border rounded-xl p-4 flex items-start justify-between gap-3 ${SEVERITY_COLORS[alert.severity]}`}>
                  <div>
                    <p className="font-semibold text-sm capitalize">{alert.severity} Alert</p>
                    <p className="text-xs mt-1 opacity-80">{alert.message}</p>
                    <p className="text-xs mt-1 opacity-60">{timeAgo(alert.createdAt)}</p>
                  </div>
                  <button onClick={() => handleDeactivate(alert._id || alert.id)}
                    className="bg-black bg-opacity-20 hover:bg-opacity-40 text-xs px-3 py-1 rounded-lg transition shrink-0">
                    Deactivate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminAlerts;
