import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import Footer from "../components/layout/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError("");

    // Get base URL — must end with /api
    const base = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

    try {
      const res = await fetch(`${base}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server error. Check that your backend is running and REACT_APP_API_URL is set correctly.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/plasu-logo.png" alt="PLASU"
              className="w-16 h-16 object-contain rounded-full bg-red-600 p-1.5 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your registered email and we'll send a reset link
            </p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">📧</span>
                </div>
                <p className="text-green-400 font-bold text-lg">Email Sent!</p>
                <p className="text-gray-400 text-sm">
                  Reset link sent to <span className="text-white font-semibold">{email}</span>.
                  Check your inbox and spam folder.
                </p>
                <p className="text-gray-500 text-xs">Link expires in 30 minutes.</p>
                <Link to="/login"
                  className="block w-full text-center bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition mt-4">
                  Back to Login
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-xl">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
                    placeholder="you@gmail.com" />
                </div>
                <button onClick={handleSubmit} disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Spinner size="sm" color="white" /> : "Send Reset Link →"}
                </button>
                <Link to="/login" className="block text-center text-sm text-gray-500 hover:text-gray-300 transition">
                  ← Back to Login
                </Link>
              </div>
            )}
          </div>

          {/* Debug info — only shows in development */}
          {process.env.NODE_ENV === "development" && (
            <p className="text-gray-600 text-xs text-center mt-3">
              API: {process.env.REACT_APP_API_URL || "http://localhost:5000/api"}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ForgotPassword;
