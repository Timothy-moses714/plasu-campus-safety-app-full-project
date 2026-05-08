import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPanicAlerts, updatePanicStatus } from "../../services/panicService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";
import Footer from "../components/layout/Footer";


const playAlertSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "square";
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    playBeep(880, 0, 0.15);
    playBeep(880, 0.2, 0.15);
    playBeep(1100, 0.4, 0.3);
  } catch (e) {
    console.log("Audio not supported");
  }
};

const AdminPanics = () => {
  const [panics, setPanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevActiveCount = useRef(0);
  const { user } = useAuth();

  const fetchPanics = useCallback(async () => {
    try {
      const res = await getPanicAlerts(user.token);
      const data = res.data || res;
      const list = Array.isArray(data) ? data : [];
      setPanics(list);

      const activeCount = list.filter(p => p.status === "active").length;
      if (activeCount > prevActiveCount.current && prevActiveCount.current >= 0) {
        if (soundEnabled) playAlertSound();
        if (Notification.permission === "granted") {
          new Notification("🚨 PLASU SafeApp - New Panic Alert!", {
            body: `A student needs help! ${activeCount} active panic alert(s).`,
            icon: "/images/plasu-logo.png",
          });
        }
      }
      prevActiveCount.current = activeCount;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token, soundEnabled]);

  useEffect(() => {
    fetchPanics();
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    const interval = setInterval(fetchPanics, 10000);
    return () => clearInterval(interval);
  }, [fetchPanics]);

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

  const activePanics = panics.filter(p => p.status === "active");
  const resolvedPanics = panics.filter(p => p.status !== "active");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white">🚨 Panic Alerts</h1>
              {activePanics.length > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {activePanics.length} ACTIVE
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-1">Real-time emergency alerts from students</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)}
              className={`text-sm px-3 py-2 rounded-lg transition ${soundEnabled ? "bg-green-700 text-white" : "bg-gray-700 text-gray-400"}`}>
              {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <button onClick={fetchPanics} className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition">
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-gray-400 flex items-center gap-2">
          <span>ℹ️</span>
          <span>Sound alerts and browser notifications enabled. Auto-refreshes every 10 seconds.</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" color="red" /></div>
        ) : panics.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">✅</p>
            <p>No panic alerts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activePanics.length > 0 && (
              <div>
                <h2 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                  Active Emergencies ({activePanics.length})
                </h2>
                <div className="space-y-4">
                  {activePanics.map((panic) => (
                    <div key={panic._id} className="bg-gray-800 border-2 border-red-600 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse mb-2">
                            🚨 ACTIVE EMERGENCY
                          </span>
                          <p className="text-white font-bold text-lg">{panic.triggeredBy?.name || "Unknown"}</p>
                          <p className="text-gray-400 text-sm">📱 <span className="text-white font-bold">{panic.triggeredBy?.phone || "N/A"}</span></p>
                          <p className="text-gray-400 text-sm">🎓 {panic.triggeredBy?.matricNumber || "N/A"}</p>
                          <p className="text-gray-400 text-sm">🏫 {panic.triggeredBy?.department || "N/A"}</p>
                          <p className="text-gray-400 text-sm">🏠 <span className="text-yellow-300 font-semibold">{panic.triggeredBy?.address || "No address"}</span></p>
                          <p className="text-gray-400 text-sm">📍 GPS: {panic.location?.lat?.toFixed(5)}, {panic.location?.lng?.toFixed(5)}</p>
                          <a href={`https://maps.google.com/?q=${panic.location?.lat},${panic.location?.lng}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition font-semibold mt-1">
                            📍 Open in Google Maps
                          </a>
                          <p className="text-gray-500 text-xs">⏱ {timeAgo(panic.createdAt)}</p>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                          <button onClick={() => handleUpdate(panic._id, "responded")} disabled={updating === panic._id}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50 font-bold">
                            {updating === panic._id ? "..." : "✓ Responded"}
                          </button>
                          <button onClick={() => handleUpdate(panic._id, "dismissed")} disabled={updating === panic._id}
                            className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-50">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resolvedPanics.length > 0 && (
              <div>
                <h2 className="text-gray-500 font-bold text-sm mb-3">Past Alerts ({resolvedPanics.length})</h2>
                <div className="space-y-3">
                  {resolvedPanics.map((panic) => (
                    <div key={panic._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-gray-300 font-semibold text-sm">{panic.triggeredBy?.name || "Unknown"}</p>
                          <p className="text-gray-500 text-xs">📱 {panic.triggeredBy?.phone} • {timeAgo(panic.createdAt)}</p>
                          <p className="text-gray-500 text-xs">🏠 {panic.triggeredBy?.address || "N/A"}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          panic.status === "responded" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"
                        }`}>{panic.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminPanics;
