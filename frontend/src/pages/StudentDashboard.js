import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [alertStatus, setAlertStatus] = useState('idle'); // idle | locating | sending | sent | error
  const [message,     setMessage]     = useState('');
  const [sentAlert,   setSentAlert]   = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const triggerPanic = async () => {
    setAlertStatus('locating');

    // Get GPS
    if (!navigator.geolocation) {
      setAlertStatus('error');
      setMessage('GPS not supported on this device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setAlertStatus('sending');

        try {
          const token = localStorage.getItem('token');
          const { data } = await axios.post(
            `${API_URL}/alerts`,
            { lat, lng, message: '' },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setSentAlert(data.alert);
          setAlertStatus('sent');
        } catch (err) {
          setMessage(err.response?.data?.message || 'Failed to send alert. Try again.');
          setAlertStatus('error');
        }
      },
      (err) => {
        setMessage('Could not get your location. Enable GPS and try again.');
        setAlertStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetAlert = () => {
    setAlertStatus('idle');
    setSentAlert(null);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-5 py-4 flex items-center justify-between shadow">
        <div>
          <p className="font-bold text-lg leading-none">PLASU Safety</p>
          <p className="text-green-200 text-xs mt-0.5">Student Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm text-green-100 hover:text-white"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-green-800 hover:bg-green-900 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-8 space-y-6">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-gray-500 text-sm">Welcome back,</p>
          <p className="text-xl font-bold text-gray-800">{user?.fullName}</p>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>

          {/* Residential badge */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              user?.residentialType === 'off-campus'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.residentialType === 'off-campus' ? 'Off-Campus' : 'On-Campus'}
            </span>
            {user?.hostelName && (
              <span className="text-xs text-gray-500">🏠 {user.hostelName}</span>
            )}
          </div>
        </div>

        {/* Panic Button */}
        {alertStatus === 'idle' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Press the button below in case of emergency. Your location will be sent to security immediately.
            </p>
            <button
              onClick={triggerPanic}
              className="w-44 h-44 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xl shadow-lg transition-all mx-auto flex items-center justify-center"
            >
              🆘 SOS
            </button>
            <p className="text-xs text-gray-400">Hold to confirm is not required — one tap sends the alert.</p>
          </div>
        )}

        {/* Locating */}
        {alertStatus === 'locating' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
            <p className="text-yellow-700 font-semibold text-lg">📡 Getting your location...</p>
            <p className="text-yellow-600 text-sm mt-2">Please wait. Do not close this page.</p>
          </div>
        )}

        {/* Sending */}
        {alertStatus === 'sending' && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-orange-700 font-semibold text-lg">🚨 Sending alert...</p>
            <p className="text-orange-600 text-sm mt-2">Contacting security now.</p>
          </div>
        )}

        {/* Sent successfully */}
        {alertStatus === 'sent' && sentAlert && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
            <p className="text-green-700 font-bold text-lg text-center">✅ Alert Sent!</p>
            <p className="text-sm text-green-700 text-center">
              Security has been notified. Stay calm and stay where you are if it is safe to do so.
            </p>
            <div className="bg-white rounded-xl p-4 text-sm space-y-1 text-gray-700">
              <p><span className="font-medium">Location:</span> {sentAlert.location.lat.toFixed(5)}, {sentAlert.location.lng.toFixed(5)}</p>
              <p><span className="font-medium">Status:</span> {sentAlert.status}</p>
              <p><span className="font-medium">Time:</span> {new Date(sentAlert.createdAt).toLocaleTimeString('en-NG')}</p>
            </div>
            <button
              onClick={resetAlert}
              className="w-full text-sm text-green-700 underline mt-2 text-center"
            >
              Send another alert
            </button>
          </div>
        )}

        {/* Error */}
        {alertStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <p className="text-red-700 font-semibold">⚠️ Could not send alert</p>
            <p className="text-sm text-red-600">{message}</p>
            <button
              onClick={resetAlert}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Address card - always visible */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Your Registered Address</h2>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-green-700 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p>🏠 {user?.hostelName  || <span className="text-gray-300">Not set</span>}</p>
            <p>🛣️ {user?.streetArea  || <span className="text-gray-300">Not set</span>}</p>
            <p>🗺️ {user?.landmark    || <span className="text-gray-300">Not set</span>}</p>
          </div>
          {(!user?.hostelName && !user?.streetArea && !user?.landmark) && (
            <p className="text-xs text-amber-600 mt-3">
              ⚠️ Please update your address in Profile so security can find you quickly.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
