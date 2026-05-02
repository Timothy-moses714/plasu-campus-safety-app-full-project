import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import UserModel from "../models/User";

const Register = () => {
  const [formData, setFormData] = useState({ ...UserModel, password: "", address: "" });
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
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email", type: "email", placeholder: "you@plasu.edu.ng" },
    { name: "matricNumber", label: "Matric Number", type: "text", placeholder: "PLASU/2021/FNAS/0001" },
    { name: "department", label: "Department/Faculty", type: "text", placeholder: "Computer Science" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "08012345678" },
    { name: "address", label: "Home/Hostel Address", type: "text", placeholder: "e.g. Block A Room 12, Male Hostel" },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="/images/senate-building.jpg" alt="PLASU Senate" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-red-900 bg-opacity-60 flex flex-col justify-end p-10">
          <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-20 h-20 object-contain mb-4" />
          <h2 className="text-white text-3xl font-bold">Join PLASU SafeApp</h2>
          <p className="text-red-200 text-lg mt-1">Student Safety Portal</p>
          <p className="text-red-300 text-sm mt-3 max-w-sm">
            Register to access emergency alerts, safe route guidance, and incident reporting.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
            <img src="/images/plasu-logo.png" alt="PLASU Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">PLASU SafeApp</h1>
              <p className="text-xs text-gray-500">Create your account</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-5">Join PLASU SafeApp today</p>

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

              <p className="text-xs text-gray-400">
                📝 Matric format: PLASU/YEAR/FACULTY/NUMBER (e.g. PLASU/2021/FNAS/0001, PLASU/2020/FSS/0011)
              </p>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={formData.password || ""} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Min. 6 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center">
                {loading ? <Spinner size="sm" color="white" /> : "Create Account"}
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
              Have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
