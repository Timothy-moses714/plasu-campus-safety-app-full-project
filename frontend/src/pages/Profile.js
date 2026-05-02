import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Profile = () => {
  const { user, login } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    department: user?.department || "",
    address: user?.address || "",
    profilePicture: user?.profilePicture || "",
  });

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePwChange = (e) => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));

  // Convert image to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm(p => ({ ...p, profilePicture: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login({ ...data.data, token: user.token });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return setPwError("Please fill in all password fields");
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setPwError("New passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return setPwError("New password must be at least 6 characters");
    }
    setPwLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwSuccess("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 pt-5 max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">👤 My Profile</h2>

        {/* Profile Picture */}
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-red-100">
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <button onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow hover:bg-red-700">
              📷
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <div className="text-center">
            <p className="font-bold text-gray-800">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role} • {user?.department}</p>
            <p className="text-gray-400 text-xs">{user?.matricNumber}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["profile", "password"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                activeTab === tab ? "bg-red-600 text-white" : "bg-white text-gray-600 shadow"
              }`}>
              {tab === "profile" ? "📝 Edit Profile" : "🔒 Change Password"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            {success && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg">{success}</div>}
            {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{error}</div>}

            {[
              { name: "name", label: "Full Name", placeholder: "John Doe" },
              { name: "phone", label: "Phone Number", placeholder: "08012345678" },
              { name: "department", label: "Department/Faculty", placeholder: "Computer Science" },
              { name: "address", label: "Home/Hostel Address", placeholder: "Block A Room 12, Male Hostel" },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input name={name} value={form[name]} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={placeholder} />
              </div>
            ))}

            {/* Read-only fields */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              <p className="text-xs text-gray-500">📧 Email: <span className="text-gray-700 font-medium">{user?.email}</span></p>
              <p className="text-xs text-gray-500">🎓 Matric: <span className="text-gray-700 font-medium">{user?.matricNumber}</span></p>
              <p className="text-xs text-gray-400 italic">These fields cannot be changed</p>
            </div>

            <button onClick={handleUpdateProfile} disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center">
              {loading ? <Spinner size="sm" color="white" /> : "Save Changes"}
            </button>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white rounded-2xl shadow p-5 space-y-4">
            {pwSuccess && <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg">{pwSuccess}</div>}
            {pwError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{pwError}</div>}

            {[
              { name: "currentPassword", label: "Current Password", key: "current" },
              { name: "newPassword", label: "New Password", key: "new" },
              { name: "confirmPassword", label: "Confirm New Password", key: "confirm" },
            ].map(({ name, label, key }) => (
              <div key={name}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    name={name} value={passwords[name]} onChange={handlePwChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="••••••••"
                  />
                  <button type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, [key]: !p[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPasswords[key] ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            ))}

            {passwords.newPassword && passwords.confirmPassword && (
              <p className={`text-xs ${passwords.newPassword === passwords.confirmPassword ? "text-green-600" : "text-red-500"}`}>
                {passwords.newPassword === passwords.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            <button onClick={handleChangePassword} disabled={pwLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center">
              {pwLoading ? <Spinner size="sm" color="white" /> : "Change Password"}
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};
export default Profile;
