import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";
import { motion } from "framer-motion";
import Footer from "../../components/layout/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter email and password.");
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      const user = data.data?.user || data.user || data;
      const token = data.data?.token || data.token;
      if (user.role !== "admin" && user.role !== "security") {
        setError("Access denied. Admin or Security accounts only.");
        setLoading(false);
        return;
      }
      login({ ...user, token });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left - Security image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        >
          <img src="/images/security-officers.jpg" alt="PLASU Security" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/70 to-transparent" />
          <div className="absolute bottom-0 p-10 w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <img src="/images/plasu-logo.png" alt="PLASU Logo"
                className="w-20 h-20 object-contain rounded-full bg-white/20 p-2 mb-6 border-2 border-white/30" />
              <h2 className="text-white text-3xl font-bold">Security Dashboard</h2>
              <p className="text-gray-300 text-lg mt-1">PLASU Campus Safety Control</p>
              <p className="text-gray-400 text-sm mt-3 max-w-sm">
                Monitor panic alerts, manage incidents and broadcast campus safety notifications in real-time.
              </p>
              <div className="flex gap-4 mt-6">
                {[["🚨", "Panic Alerts"], ["📋", "Incidents"], ["📢", "Broadcasts"]].map(([icon, label], i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
                    <p className="text-white text-lg">{icon}</p>
                    <p className="text-gray-300 text-xs mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center px-4 min-h-screen"
        >
          <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
              <img src="/images/plasu-logo.png" alt="PLASU Logo"
                className="w-14 h-14 object-contain rounded-full bg-red-600 p-1.5" />
              <div>
                <h1 className="text-xl font-bold text-white">PLASU SafeApp</h1>
                <p className="text-xs text-gray-400">Admin & Security Portal</p>
              </div>
            </div>

            <div className="mb-8 hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🛡</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
              </div>
              <p className="text-gray-400 text-sm">Sign in with your admin credentials</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-xl mb-4">
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
                  placeholder="admin@plasu.edu.ng" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit} disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Spinner size="sm" color="white" /> : <>Sign In to Dashboard →</>}
              </motion.button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              Student?{" "}
              <a href="/login" className="text-red-400 hover:text-red-300">Go to Student Login</a>
            </p>
          </div>
        </motion.div>
      </div>
      <footer />
    </div>
  );
};
export default AdminLogin;
