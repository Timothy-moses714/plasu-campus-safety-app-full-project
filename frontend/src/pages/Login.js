import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      login(data.user || data);
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
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Sign in to your account</p>
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
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} fullWidth size="lg" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : "Sign In"}
          </Button>
        </div>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          No account?{" "}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
