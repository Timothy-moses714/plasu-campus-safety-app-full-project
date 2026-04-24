import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleSubmit = async () => {
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6">
          <span className="text-4xl sm:text-5xl">🔐</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">Forgot Password</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-green-700 font-bold text-lg">📧 Email Sent!</p>
              <p className="text-green-600 text-sm mt-2">
                A password reset link has been sent to <strong>{email}</strong>.
                Please check your inbox and spam folder.
              </p>
              <p className="text-green-500 text-xs mt-2">Link expires in 30 minutes.</p>
            </div>
            <Link to="/login"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-lg">{error}</div>
            )}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="you@plasu.edu.ng"
              />
            </div>
            <Button onClick={handleSubmit} fullWidth size="lg" disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Send Reset Link"}
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
export default ForgotPassword;
