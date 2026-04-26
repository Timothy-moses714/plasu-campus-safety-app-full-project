import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getIncidents, updateIncidentStatus } from "../../services/incidentService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const STATUS_COLORS = {
  pending: "bg-yellow-900 text-yellow-300",
  acknowledged: "bg-blue-900 text-blue-300",
  resolved: "bg-green-900 text-green-300",
};

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    getIncidents(user.token)
      .then(res => { setIncidents(res.data || []); setFiltered(res.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let data = [...incidents];
    if (statusFilter !== "all") data = data.filter(i => i.status === statusFilter);
    if (typeFilter !== "all") data = data.filter(i => i.type === typeFilter);
    setFiltered(data);
  }, [statusFilter, typeFilter, incidents]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await updateIncidentStatus(id, status, user.token);
      setIncidents(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
    } catch { alert("Failed to update"); }
    finally { setUpdating(null); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">📋 Incident Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all campus incident reports</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="all">All Types</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="fire">Fire</option>
            <option value="other">Other</option>
          </select>
          <span className="text-gray-400 text-sm self-center">{filtered.length} incidents</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" color="red" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No incidents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((inc) => (
              <div key={inc._id}
                onClick={() => setSelected(inc)}
                className="bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-2xl p-5 cursor-pointer transition">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-white font-bold text-sm">{inc.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_COLORS[inc.status]}`}>
                    {inc.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2 capitalize">
                  🏷 {inc.type?.replace(/_/g, " ")}
                </p>
                <p className="text-gray-500 text-xs line-clamp-2">{inc.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                  <p className="text-gray-400 text-xs">👤 {inc.reportedBy?.name || "Unknown"}</p>
                  <p className="text-gray-500 text-xs">{timeAgo(inc.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setSelected(null)} />
            <div className="relative bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg z-10 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-white font-bold text-lg">{selected.title}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs capitalize">{selected.type?.replace(/_/g, " ")}</span>
                </div>
                <p className="text-gray-300">{selected.description || "No description"}</p>
                <div className="bg-gray-700 rounded-xl p-4 space-y-1">
                  <p className="text-gray-400 text-xs">👤 <span className="text-white">{selected.reportedBy?.name}</span></p>
                  <p className="text-gray-400 text-xs">🎓 <span className="text-white">{selected.reportedBy?.matricNumber}</span></p>
                  <p className="text-gray-400 text-xs">🏫 <span className="text-white">{selected.reportedBy?.department}</span></p>
                  <p className="text-gray-400 text-xs">📍 Lat: {selected.location?.lat?.toFixed(5)}, Lng: {selected.location?.lng?.toFixed(5)}</p>
                  <p className="text-gray-400 text-xs">⏱ {timeAgo(selected.createdAt)}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  {selected.status === "pending" && (
                    <button onClick={() => handleStatusUpdate(selected._id, "acknowledged")} disabled={updating === selected._id}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition">
                      Acknowledge
                    </button>
                  )}
                  {selected.status !== "resolved" && (
                    <button onClick={() => handleStatusUpdate(selected._id, "resolved")} disabled={updating === selected._id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition">
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminIncidents;
