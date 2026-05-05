import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleSubmit = async () => {
    if (!password || !confirmPassword) return setError("Please fill in both fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
      const user = data.data?.user || data.user;
      const authToken = data.data?.token || data.token;
      login({ ...user, token: authToken });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Reset failed. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Set New Password</h1>
          <p className="text-gray-400 text-sm mt-2">Enter your new password below</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
          {success ? (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-green-400 font-bold text-lg">Password Reset!</p>
              <p className="text-gray-400 text-sm">Your password has been updated. Redirecting...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 text-xs p-3 rounded-xl">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
                    placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
                    placeholder="Repeat your password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-xs ${password === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                  {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Spinner size="sm" color="white" /> : "Reset Password →"}
              </button>
              <Link to="/login" className="block text-center text-sm text-gray-500 hover:text-gray-300 transition">
                ← Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
