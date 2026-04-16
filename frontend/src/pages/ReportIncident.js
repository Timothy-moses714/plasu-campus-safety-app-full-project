import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { reportIncident } from "../services/incidentService";
import { useAuth } from "../context/AuthContext";
import IncidentModel from "../models/Incident";
import useLocation from "../hooks/useLocation";

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
    } catch {
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 pt-6 space-y-5">
        <h2 className="text-xl font-bold text-gray-800">📋 Report Incident</h2>
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-700 font-bold text-lg">✓ Report Submitted</p>
            <p className="text-sm text-green-600 mt-1">Security has been notified. Redirecting...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Title</label>
              <input name="title" value={form.title} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Brief title of the incident" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select type...</option>
                {INCIDENT_TYPES.map((t) => <option key={t} value={t.toLowerCase().replace(/ /g, "_")}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Describe what happened..." />
            </div>
            <p className="text-xs text-gray-400">
              📍 {location ? `Location captured (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : "Capturing your location..."}
            </p>
            <Button onClick={handleSubmit} fullWidth disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Submit Report"}
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};
export default ReportIncident;
