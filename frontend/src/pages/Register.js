import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import UserModel from "../models/User";

const Register = () => {
  const [formData, setFormData] = useState({ ...UserModel, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await registerUser(formData);
      const user = data.data?.user || data.user || data;
      const token = data.data?.token || data.token;
      login({ ...user, token });
      navigate("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email", type: "email", placeholder: "you@plasu.edu.ng" },
    { name: "matricNumber", label: "Matric Number", type: "text", placeholder: "PLU/CSC/2021/001" },
    { name: "department", label: "Department", type: "text", placeholder: "Computer Science" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "08012345678" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-5">
          <span className="text-4xl sm:text-5xl">🛡</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Join PLASU SafeApp</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-lg mb-4">{error}</div>
        )}
        <div className="space-y-3">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type} name={name} value={formData[name] || ""} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* Password field with toggle */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password" value={formData.password || ""} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <Button onClick={handleSubmit} fullWidth size="lg" disabled={loading}>
            {loading ? <Spinner size="sm" color="white" /> : "Register"}
          </Button>
        </div>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          Have an account?{" "}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
