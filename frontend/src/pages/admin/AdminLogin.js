import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

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
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Security image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="/images/security-officers.jpg" alt="PLASU Security" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col justify-end p-10">
          <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-20 h-20 object-contain mb-4" />
          <h2 className="text-white text-3xl font-bold">Security Dashboard</h2>
          <p className="text-gray-300 text-lg mt-1">PLASU Campus Safety Control</p>
          <p className="text-gray-400 text-sm mt-3 max-w-sm">
            Monitor panic alerts, manage incidents and broadcast campus safety notifications.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
            <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-white">PLASU SafeApp</h1>
              <p className="text-xs text-gray-400">Admin & Security Portal</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-1">Admin Portal</h2>
            <p className="text-gray-400 text-sm mb-6">Sign in with your admin credentials</p>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-lg mb-4">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="admin@plasu.edu.ng"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center">
                {loading ? <Spinner size="sm" color="white" /> : "Sign In to Dashboard"}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              Student?{" "}
              <a href="/login" className="text-red-400 hover:underline">Go to Student Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
