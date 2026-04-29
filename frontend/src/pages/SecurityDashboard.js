import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AlertCard from '../components/admin/AlertCard';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const SecurityDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState('active'); // active | all

  const fetchAlerts = useCallback(async () => {
    try {
      const token    = localStorage.getItem('token');
      const endpoint = filter === 'active' ? '/alerts/active' : '/alerts';
      const { data } = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(data.alerts);
    } catch (err) {
      setError('Failed to load alerts. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Poll every 15 seconds for new alerts
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Update a single alert card in state after status change
  const handleStatusUpdate = (alertId, newStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a._id === alertId ? { ...a, status: newStatus } : a))
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-5 py-4 flex items-center justify-between shadow">
        <div>
          <p className="font-bold text-lg leading-none">PLASU Safety</p>
          <p className="text-green-200 text-xs mt-0.5">Security Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-green-100">{user?.fullName}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-green-800 hover:bg-green-900 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{activeCount}</p>
            <p className="text-xs text-gray-500 mt-1">Active Alerts</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {alerts.filter((a) => a.status === 'responding').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Responding</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {alerts.filter((a) => a.status === 'resolved').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Resolved</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => { setFilter('active'); setLoading(true); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'active'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => { setFilter('all'); setLoading(true); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-green-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => { setLoading(true); fetchAlerts(); }}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center text-gray-400 py-12">Loading alerts...</div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-medium text-gray-600">No alerts at the moment</p>
            <p className="text-sm mt-1">The dashboard refreshes every 15 seconds.</p>
          </div>
        )}

        {!loading && !error && alerts.map((alert) => (
          <AlertCard
            key={alert._id}
            alert={alert}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}

      </div>
    </div>
  );
};

export default SecurityDashboard;
