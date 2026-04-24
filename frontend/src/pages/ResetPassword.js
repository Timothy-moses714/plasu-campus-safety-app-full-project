import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl sm:text-5xl">🔑</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">Set New Password</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Enter your new password below</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-green-700 font-bold text-lg">✅ Password Reset!</p>
              <p className="text-green-600 text-sm mt-2">
                Your password has been updated. Redirecting to home...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-lg">{error}</div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Repeat your password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Password match indicator */}
            {confirmPassword.length > 0 && (
              <p className={`text-xs ${password === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}

            <Button onClick={handleSubmit} fullWidth size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Reset Password"}
            </Button>

            <Link to="/login"
              className="block text-center text-xs sm:text-sm text-gray-500 hover:text-red-600 transition">
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
