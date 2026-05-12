import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/layout/StudentLayout";
import Spinner from "../components/common/Spinner";
import { reportIncident } from "../services/incidentService";
import { useAuth } from "../context/AuthContext";
import IncidentModel from "../models/Incident";
import useLocation from "../hooks/useLocation";
import Footer from "../components/layout/Footer";


const INCIDENT_TYPES = ["Theft", "Assault", "Suspicious Activity", "Fire", "Other"];

const ReportIncident = () => {
  const [form, setForm] = useState({ ...IncidentModel });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { location } = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.type) return alert("Please fill in title and incident type.");
    setLoading(true);
    try {
      await reportIncident({ ...form, location: location || form.location }, user.token);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch { alert("Failed to submit report. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {/* Header image */}
        <div className="relative h-36 sm:h-44 rounded-2xl overflow-hidden shadow-lg">
          <img src="/images/fire-safety.jpg" alt="Campus Safety" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-transparent flex items-center px-5">
            <div>
              <h1 className="text-white font-bold text-lg sm:text-xl">📋 Report Incident</h1>
              <p className="text-red-200 text-xs sm:text-sm mt-1">Help keep campus safe</p>
            </div>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-green-700 font-bold text-lg">Report Submitted!</p>
            <p className="text-green-600 text-sm mt-2">Security has been notified. Redirecting...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                <option value="">Select type...</option>
                {INCIDENT_TYPES.map(t => <option key={t} value={t.toLowerCase().replace(/ /g, "_")}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Describe what happened in detail..." />
            </div>
            <p className="text-xs text-gray-400">
              📍 {location ? `Location captured (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : "Capturing your location..."}
            </p>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center">
              {loading ? <Spinner size="sm" color="white" /> : "Submit Report"}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </StudentLayout>
  );
};
export default ReportIncident;
