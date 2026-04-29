import { useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";;

// Status badge colours
const STATUS_STYLES = {
  active:     'bg-red-100 text-red-700 border border-red-200',
  responding: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  resolved:   'bg-green-100 text-green-700 border border-green-200',
};

const RESIDENTIAL_BADGE = {
  'on-campus':  'bg-blue-100 text-blue-700',
  'off-campus': 'bg-orange-100 text-orange-700',
};

const AlertCard = ({ alert, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const {
    _id,
    status,
    createdAt,
    location,
    message,
    studentSnapshot = {},
    studentAddress  = {},
  } = alert;

  const { fullName, phoneNumber, matricNumber } = studentSnapshot;
  const { residentialType, hostelName, streetArea, landmark } = studentAddress;

  const googleMapsLink = location?.lat && location?.lng
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/alerts/${_id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onStatusUpdate) onStatusUpdate(_id, newStatus);
    } catch (err) {
      console.error('Failed to update alert status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">

      {/* ── Header Row ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[status] || ''}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(createdAt).toLocaleString('en-NG', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>

        {/* Live GPS link */}
        {googleMapsLink && (
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-green-700 font-medium hover:underline"
          >
            📍 Open Map
          </a>
        )}
      </div>

      {/* ── Student Info ────────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Information</h3>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-xs text-gray-400">Full Name</p>
            <p className="font-medium text-gray-800">{fullName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <a
              href={`tel:${phoneNumber}`}
              className="font-medium text-green-700 hover:underline"
            >
              {phoneNumber || '—'}
            </a>
          </div>
          <div>
            <p className="text-xs text-gray-400">Matric No.</p>
            <p className="font-medium text-gray-800">{matricNumber || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">GPS Coordinates</p>
            <p className="font-medium text-gray-800 text-xs">
              {location?.lat?.toFixed(5)}, {location?.lng?.toFixed(5)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Residential Address ─────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-700">Residential Address</h3>
          {residentialType && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RESIDENTIAL_BADGE[residentialType] || 'bg-gray-100 text-gray-600'}`}>
              {residentialType === 'off-campus' ? 'Off-Campus' : 'On-Campus'}
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">🏠</span>
            <div>
              <p className="text-xs text-gray-400">Hostel / House</p>
              <p className="font-medium text-gray-800">{hostelName || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">🛣️</span>
            <div>
              <p className="text-xs text-gray-400">Street / Area</p>
              <p className="font-medium text-gray-800">{streetArea || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">🗺️</span>
            <div>
              <p className="text-xs text-gray-400">Nearest Landmark</p>
              <p className="font-medium text-gray-800">{landmark || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alert Message ───────────────────────────────────────────────── */}
      {message && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-0.5">Student Message</p>
          <p className="text-sm text-gray-800 font-medium">"{message}"</p>
        </div>
      )}

      {/* ── Action Buttons ──────────────────────────────────────────────── */}
      {status !== 'resolved' && (
        <div className="flex gap-3 pt-1">
          {status === 'active' && (
            <button
              onClick={() => handleStatusChange('responding')}
              disabled={updating}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {updating ? 'Updating...' : '🚨 Mark Responding'}
            </button>
          )}
          <button
            onClick={() => handleStatusChange('resolved')}
            disabled={updating}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {updating ? 'Updating...' : '✅ Mark Resolved'}
          </button>
        </div>
      )}

      {status === 'resolved' && (
        <p className="text-center text-xs text-gray-400 pt-1">This alert has been resolved.</p>
      )}
    </div>
  );
};

export default AlertCard;
