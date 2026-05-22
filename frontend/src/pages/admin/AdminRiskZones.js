import { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const LEVEL_COLORS = {
  high:   "bg-red-900 border-red-600",
  medium: "bg-yellow-900 border-yellow-600",
  low:    "bg-green-900 border-green-600",
};
const LEVEL_TEXT = { high: "text-red-300", medium: "text-yellow-300", low: "text-green-300" };
const LEVEL_ICONS = { high: "🔴", medium: "🟡", low: "🟢" };

const AdminRiskZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/riskzones`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setZones(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  const handleAutoClassify = async () => {
    setClassifying(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/riskzones/auto-classify`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Classification failed");
      await fetchZones();
    } catch (err) {
      setError(err.message || "Classification failed. Check backend connection.");
    } finally {
      setClassifying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this risk zone?")) return;
    try {
      await fetch(`${BASE_URL}/riskzones/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setZones(prev => prev.filter(z => z._id !== id));
    } catch {
      alert("Failed to remove zone");
    }
  };

  const stats = {
    high: zones.filter(z => z.level === "high").length,
    medium: zones.filter(z => z.level === "medium").length,
    low: zones.filter(z => z.level === "low").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">🤖 ML Risk Zone Classification</h1>
            <p className="text-gray-400 text-sm mt-1">AI-powered campus safety risk analysis</p>
          </div>
          <button onClick={handleAutoClassify} disabled={classifying}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50 flex items-center gap-2 text-sm">
            {classifying ? <><Spinner size="sm" color="white" /> Classifying...</> : "🤖 Run ML Classification"}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Info card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <p className="text-white font-semibold text-sm mb-2">How the ML Model Works</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            The Random Forest-inspired classifier analyses each campus location based on incident history,
            lighting conditions, isolation level, and time of day. Locations are scored and classified
            as High (🔴 score ≥60), Medium (🟡 score ≥30), or Low (🟢 score below 30) risk.
          </p>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="text-red-400">🔴 High: {stats.high} zones</span>
            <span className="text-yellow-400">🟡 Medium: {stats.medium} zones</span>
            <span className="text-green-400">🟢 Low: {stats.low} zones</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" color="red" /></div>
        ) : zones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-5xl mb-3">🤖</p>
            <p className="font-semibold text-white">No risk zones classified yet</p>
            <p className="text-sm mt-1">Click "Run ML Classification" to analyse all campus locations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <div key={zone._id} className={`border rounded-2xl p-4 ${LEVEL_COLORS[zone.level] || "bg-gray-800 border-gray-700"}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{LEVEL_ICONS[zone.level]}</span>
                      <p className={`font-bold text-sm ${LEVEL_TEXT[zone.level]}`}>{zone.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block capitalize ${
                      zone.level === "high" ? "bg-red-700 text-white" :
                      zone.level === "medium" ? "bg-yellow-700 text-white" :
                      "bg-green-700 text-white"
                    }`}>{zone.level} risk</span>
                  </div>
                  <button onClick={() => handleDelete(zone._id)}
                    className="text-gray-500 hover:text-red-400 text-sm transition shrink-0">✕</button>
                </div>
                <div className={`space-y-1 text-xs ${LEVEL_TEXT[zone.level]} opacity-80`}>
                  <p>📍 {zone.location?.lat?.toFixed(4)}, {zone.location?.lng?.toFixed(4)}</p>
                  <p>💡 Lighting: {zone.features?.lighting}</p>
                  <p>🏚 Isolated: {zone.features?.isolated ? "Yes" : "No"}</p>
                  <p>📋 Incidents nearby: {zone.features?.incidentCount}</p>
                  <p>🌙 High risk at: {zone.features?.timeOfDay}</p>
                </div>
                <a href={`https://maps.google.com/?q=${zone.location?.lat},${zone.location?.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs underline opacity-70 hover:opacity-100">
                  📍 View on Maps
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminRiskZones;
