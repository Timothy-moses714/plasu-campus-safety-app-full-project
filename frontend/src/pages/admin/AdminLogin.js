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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛡</span>
          </div>
          <h1 className="text-2xl font-bold text-white">PLASU SafeApp</h1>
          <p className="text-gray-400 text-sm mt-1">Admin & Security Portal</p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" color="white" /> : "Sign In to Dashboard"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Student?{" "}
          <a href="/login" className="text-red-400 hover:underline">Go to Student Login</a>
        </p>
      </div>
    </div>
  );
};
export default AdminLogin;
