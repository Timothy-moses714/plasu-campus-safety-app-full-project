import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";
import { getIncidents } from "../services/incidentService";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/formatDate";
import Spinner from "../components/common/Spinner";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  pending:      "bg-yellow-100 text-yellow-700 border-yellow-200",
  acknowledged: "bg-blue-100 text-blue-700 border-blue-200",
  resolved:     "bg-green-100 text-green-700 border-green-200",
};

const STATUS_ICONS = { pending: "⏳", acknowledged: "👀", resolved: "✅" };

const MyIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getIncidents(user.token);
        const data = res.data || res;
        setIncidents(Array.isArray(data) ? data : []);
      } catch { setIncidents([]); }
      finally { setLoading(false); }
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">📋 My Reports</h2>
            <p className="text-gray-500 text-xs mt-1">Track your submitted incident reports</p>
          </div>
          <Link to="/report"
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
            + New Report
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <p className="text-5xl mb-3">📋</p>
            <p className="text-gray-600 font-semibold">No reports submitted yet</p>
            <p className="text-gray-400 text-sm mt-1">Report any suspicious activity to keep campus safe</p>
            <Link to="/report"
              className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm">
              Submit a Report
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc, i) => (
              <motion.div key={inc._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-gray-800 font-bold text-sm">{inc.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full border font-semibold shrink-0 ${STATUS_STYLES[inc.status] || STATUS_STYLES.pending}`}>
                    {STATUS_ICONS[inc.status]} {inc.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs capitalize mb-2">
                  🏷 {inc.type?.replace(/_/g, " ")}
                </p>
                {inc.description && (
                  <p className="text-gray-400 text-xs line-clamp-2 mb-2">{inc.description}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <p className="text-gray-400 text-xs">📍 {inc.location?.lat ? `${inc.location.lat.toFixed(3)}, ${inc.location.lng.toFixed(3)}` : "Location N/A"}</p>
                  <p className="text-gray-400 text-xs">⏱ {timeAgo(inc.createdAt)}</p>
                </div>
                {inc.status === "resolved" && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-2">
                    <p className="text-green-700 text-xs font-semibold">✅ This incident has been resolved by security</p>
                  </div>
                )}
                {inc.status === "acknowledged" && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-2">
                    <p className="text-blue-700 text-xs font-semibold">👀 Security is reviewing this report</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
export default MyIncidents;
