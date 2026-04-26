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
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Campus image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="/images/campus-main.jpg"
          alt="PLASU Campus Gate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-900 bg-opacity-60 flex flex-col justify-end p-10">
          <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-20 h-20 object-contain mb-4" />
          <h2 className="text-white text-3xl font-bold leading-tight">
            Plateau State University
          </h2>
          <p className="text-red-200 text-lg mt-1">Bokkos Campus Safety App</p>
          <p className="text-red-300 text-sm mt-3 max-w-sm">
            Keeping students safe with real-time emergency alerts and smart route guidance.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
            <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">PLASU SafeApp</h1>
              <p className="text-xs text-gray-500">Campus Safety System</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">Sign in to your student account</p>

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
                  <Link to="/forgot-password" className="text-xs text-red-600 hover:underline font-medium">
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
              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center">
                {loading ? <Spinner size="sm" color="white" /> : "Sign In"}
              </button>
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
      </div>
    </div>
  );
};
export default Login;
