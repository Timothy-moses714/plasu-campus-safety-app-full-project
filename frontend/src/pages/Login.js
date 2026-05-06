import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter your email and password.");
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      const user = data.data?.user || data.user || data;
      const token = data.data?.token || data.token;
      if (user.role === "admin" || user.role === "security") {
        setError("Admin/Security accounts must use the Admin Portal.");
        setLoading(false);
        return;
      }
      login({ ...user, token });
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image with overlay */}
      <div className="min-h-screen flex">
  {/* Left - Image */}
  <div className="hidden lg:flex lg:w-1/2 relative">
    
    {/* Background Image */}
    <img
      src="/images/campus-gate.jpg"
      alt="PLASU Campus"
      className="w-full h-full object-cover"
    />

    {/* Content */}
    <div className="absolute bottom-0 p-10 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent">
      
      <img
        src="/images/plasu-logo.png"
        alt="PLASU Logo"
        className="w-20 h-20 object-contain rounded-full bg-white/80 p-2 mb-6 shadow-lg"
      />

      <h2 className="text-white text-3xl font-bold leading-tight">
        Welcome Back to
      </h2>
      <h2 className="text-red-400 text-3xl font-bold">
        PLASU SafeApp
      </h2>

      <p className="text-gray-200 text-sm mt-3 max-w-sm leading-relaxed">
        Your campus safety companion. Emergency alerts, safe routes and
        incident reporting — all in one place.
      </p>

      <div className="flex gap-4 mt-6">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30">
          <p className="text-white text-lg">🛡</p>
          <p className="text-gray-200 text-xs mt-1">Emergency Alerts</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30">
          <p className="text-white text-lg">🗺</p>
          <p className="text-gray-200 text-xs mt-1">Safe Routes</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30">
          <p className="text-white text-lg">📋</p>
          <p className="text-gray-200 text-xs mt-1">Report Incidents</p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Right - Dark form */}
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img src="/images/plasu-logo.png" alt="PLASU Logo"
              className="w-14 h-14 object-contain rounded-full bg-red-600 p-1.5" />
            <div>
              <h1 className="text-xl font-bold text-white">PLASU SafeApp</h1>
              <p className="text-xs text-gray-400">Campus Safety System</p>
            </div>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 text-sm mt-1">Access your student safety portal</p>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 text-xs sm:text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                placeholder="you@plasu.edu.ng" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-red-400 hover:text-red-300 font-medium">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? <Spinner size="sm" color="white" /> : <>Sign In <span>→</span></>}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-400 font-semibold hover:text-red-300">Create Account</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-center text-xs text-gray-600 mb-3">Staff or Security Officer?</p>
            <Link to="/admin/login"
              className="flex items-center justify-center gap-2 w-full border border-gray-700 hover:border-red-600 hover:bg-gray-800 text-gray-400 hover:text-red-400 text-sm font-semibold py-3 rounded-xl transition-all duration-200">
              <span>🛡</span>
              <span>Admin / Security Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
