import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAlerts } from "../../services/alertService";
import { getIncidents } from "../../services/incidentService";
import { getAllUsers } from "../../services/userService";
import { getPanicAlerts } from "../../services/panicService";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/formatDate";
import Spinner from "../../components/common/Spinner";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ panics: 0, incidents: 0, alerts: 0, users: 0 });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [recentPanics, setRecentPanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [panicsRes, incidentsRes, alertsRes, usersRes] = await Promise.all([
          getPanicAlerts(user.token),
          getIncidents(user.token),
          getAlerts(user.token),
          getAllUsers(user.token),
        ]);
        const panics = panicsRes.data || [];
        const incidents = incidentsRes.data || [];
        const alerts = alertsRes.data || [];
        const users = usersRes.data || [];
        setStats({
          panics: panics.filter(p => p.status === "active").length,
          incidents: incidents.filter(i => i.status === "pending").length,
          alerts: alerts.length,
          users: users.length,
        });
        setRecentIncidents(incidents.slice(0, 5));
        setRecentPanics(panics.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user.token]);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64"><Spinner size="lg" color="red" /></div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🚨" label="Active Panics" value={stats.panics} color="bg-red-900" />
          <StatCard icon="📋" label="Pending Incidents" value={stats.incidents} color="bg-yellow-900" />
          <StatCard icon="📢" label="Active Alerts" value={stats.alerts} color="bg-blue-900" />
          <StatCard icon="👥" label="Total Students" value={stats.users} color="bg-green-900" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Panics */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4">🚨 Recent Panic Alerts</h2>
            {recentPanics.length === 0 ? (
              <p className="text-gray-500 text-sm">No panic alerts yet</p>
            ) : (
              <div className="space-y-3">
                {recentPanics.map((p) => (
                  <div key={p._id} className="flex items-center justify-between border-b border-gray-700 pb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{p.triggeredBy?.name || "Unknown"}</p>
                      <p className="text-gray-400 text-xs">{p.triggeredBy?.phone} • {timeAgo(p.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      p.status === "active" ? "bg-red-900 text-red-300" :
                      p.status === "responded" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-300"
                    }`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Incidents */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
            <h2 className="text-white font-bold mb-4">📋 Recent Incidents</h2>
            {recentIncidents.length === 0 ? (
              <p className="text-gray-500 text-sm">No incidents reported yet</p>
            ) : (
              <div className="space-y-3">
                {recentIncidents.map((inc) => (
                  <div key={inc._id} className="flex items-center justify-between border-b border-gray-700 pb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{inc.title}</p>
                      <p className="text-gray-400 text-xs">{inc.reportedBy?.name} • {timeAgo(inc.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      inc.status === "pending" ? "bg-yellow-900 text-yellow-300" :
                      inc.status === "acknowledged" ? "bg-blue-900 text-blue-300" : "bg-green-900 text-green-300"
                    }`}>{inc.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
