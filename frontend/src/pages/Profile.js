import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName:        '',
    email:           '',
    phoneNumber:     '',
    matricNumber:    '',
    // ── Address fields ──────────────────────────────
    residentialType: 'on-campus',
    hostelName:      '',
    streetArea:      '',
    landmark:        '',
  });

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');

  // ── Load current profile on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = data.user;
        setFormData({
          fullName:        u.fullName        || '',
          email:           u.email           || '',
          phoneNumber:     u.phoneNumber     || '',
          matricNumber:    u.matricNumber    || '',
          residentialType: u.residentialType || 'on-campus',
          hostelName:      u.hostelName      || '',
          streetArea:      u.streetArea      || '',
          landmark:        u.landmark        || '',
        });
      } catch (err) {
        setError('Could not load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/auth/profile`,
        {
          fullName:        formData.fullName,
          phoneNumber:     formData.phoneNumber,
          matricNumber:    formData.matricNumber,
          residentialType: formData.residentialType,
          hostelName:      formData.hostelName,
          streetArea:      formData.streetArea,
          landmark:        formData.landmark,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-xl font-bold text-green-700 mb-1">My Profile</h1>
        <p className="text-gray-500 text-sm mb-6">
          Keep your address up to date — security uses this during emergencies.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Personal Details ── */}
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Personal Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
            <input
              type="text"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* ── Residential / Address Details ── */}
          <div className="pt-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Residential Details
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              This is shown to security when you trigger an alert.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Where do you live?</label>
            <select
              name="residentialType"
              value={formData.residentialType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="on-campus">On-Campus</option>
              <option value="off-campus">Off-Campus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hostel / House Name
            </label>
            <input
              type="text"
              name="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              placeholder={
                formData.residentialType === 'on-campus'
                  ? 'e.g. Block A Room 14, Male Hostel'
                  : 'e.g. Grace Hostel, Room 5'
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street / Area</label>
            <input
              type="text"
              name="streetArea"
              value={formData.streetArea}
              onChange={handleChange}
              placeholder="e.g. Butura Road, Behind Faculty of Law"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="e.g. Opposite First Bank, Near PLASU Main Gate"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
