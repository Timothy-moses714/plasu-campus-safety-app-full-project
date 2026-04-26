import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPanicAlerts, updatePanicStatus } from "../../services/panicService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const AdminPanics = () => {
  const [panics, setPanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const { user } = useAuth();

  const fetchPanics = useCallback(async () => {
    try {
      const res = await getPanicAlerts(user.token);
      const data = res.data || res;
      setPanics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchPanics(); }, [fetchPanics]);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updatePanicStatus(id, status, user.token);
      setPanics(prev => prev.map(p => (p._id === id ? { ...p, status } : p)));
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">🚨 Panic Alerts</h1>
            <p className="text-gray-400 text-sm mt-1">All emergency panic alerts from students</p>
          </div>
          <button onClick={fetchPanics} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" color="red" /></div>
        ) : panics.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">✅</p>
            <p>No panic alerts yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {panics.map((panic) => (
              <div key={panic._id} className={`bg-gray-800 border rounded-2xl p-5 ${panic.status === "active" ? "border-red-600" : "border-gray-700"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    {panic.status === "active" && (
                      <span className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse mb-2">
                        🚨 ACTIVE
                      </span>
                    )}
                    <p className="text-white font-bold text-lg">{panic.triggeredBy?.name || "Unknown Student"}</p>
                    <p className="text-gray-400 text-sm">📱 {panic.triggeredBy?.phone || "N/A"}</p>
                    <p className="text-gray-400 text-sm">🎓 {panic.triggeredBy?.matricNumber || "N/A"}</p>
                    <p className="text-gray-400 text-sm">🏫 {panic.triggeredBy?.department || "N/A"}</p>
                    <p className="text-gray-400 text-sm">📍 Lat: {panic.location?.lat?.toFixed(5)}, Lng: {panic.location?.lng?.toFixed(5)}</p>
                    <p className="text-gray-500 text-xs">⏱ {timeAgo(panic.createdAt)}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2">
                    {panic.status === "active" && (
                      <button onClick={() => handleUpdate(panic._id, "responded")} disabled={updating === panic._id}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50">
                        {updating === panic._id ? "..." : "✓ Responded"}
                      </button>
                    )}
                    {panic.status !== "dismissed" && (
                      <button onClick={() => handleUpdate(panic._id, "dismissed")} disabled={updating === panic._id}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50">
                        Dismiss
                      </button>
                    )}
                    {panic.status !== "active" && (
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold text-center ${panic.status === "responded" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-300"}`}>
                        {panic.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminPanics;
