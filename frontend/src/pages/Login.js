import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
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
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-5 sm:mb-6">
          <span className="text-4xl sm:text-5xl">🛡</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">PLASU SafeApp</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Student Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@plasu.edu.ng"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password"
                className="text-xs text-red-600 hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <Button onClick={handleSubmit} fullWidth size="lg" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : "Sign In"}
          </Button>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          No account?{" "}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">Register</Link>
        </p>

        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400 mb-3">Are you Admin or Security Staff?</p>
          <Link to="/admin/login"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-semibold py-2.5 rounded-lg transition">
            <span>🛡</span>
            <span>Login as Admin / Security</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
