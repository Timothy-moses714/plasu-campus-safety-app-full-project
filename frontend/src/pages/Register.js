import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import UserModel from "../models/User";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";

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
    { name: "name", label: "Full Name", type: "text", placeholder: "Moses Timothy Ajiji", span: true },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@gmail.com", span: true },
    { name: "matricNumber", label: "Matric Number", type: "text", placeholder: "PLASU/2020/FNAS/0001" },
    { name: "department", label: "Department / Faculty", type: "text", placeholder: "Computer Science" },
    { name: "phone", label: "Phone Number", type: "tel", placeholder: "08012345678" },
    { name: "address", label: "Home / Hostel Address", type: "text", placeholder: "Hostel, Across, Ndar, Chikam.(House name)" },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -120 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}
          className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
          <img src="/images/senate-building.jpg" alt="PLASU Senate" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800/80 to-red-900/60" />
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <motion.div initial={{ opacity: 0, y: 120 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <img src="/images/plasu-logo.png" alt="PLASU Logo"
                className="w-16 h-16 object-contain rounded-full bg-white/20 p-1.5 mb-6 border-2 border-white/30" />
              <h2 className="text-white text-2xl font-bold">PLASU SafeApp</h2>
              <p className="text-gray-300 text-sm mt-1">Plateau State University, Bokkos</p>
              <div className="mt-8 space-y-3">
                {["Real-time emergency panic button", "GPS-based safe route navigation",
                  "Campus incident reporting", "Instant security notifications",
                  "ML-powered risk zone detection"].map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -120 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/30 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    </div>
                    <p className="text-gray-300 text-xs">{f}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-10 italic">"Knowledge, Diligence, Integrity"</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-3/5 bg-gray-900 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <img src="/images/plasu-logo.png" alt="PLASU Logo"
                className="w-12 h-12 object-contain rounded-full bg-red-600 p-1.5" />
              <div>
                <h1 className="text-lg font-bold text-white">PLASU SafeApp</h1>
                <p className="text-xs text-gray-400">Create your account</p>
              </div>
            </div>

            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <p className="text-gray-400 text-sm mt-1">Join the PLASU Campus Safety System</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-900 border border-red-700 text-red-200 text-xs p-3 rounded-xl mb-4">
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(({ name, label, type, placeholder, span }) => (
                <div key={name} className={span ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                  <input type={type} name={name} value={formData[name] || ""} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                    placeholder={placeholder} />
                </div>
              ))}

              <div className="sm:col-span-2">
                <p className="text-xs text-gray-600 mb-2">📝 Matric format: PLASU/YEAR/FACULTY/NUMBER e.g. PLASU/2021/FNAS/0001</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"}
                    name="password" value={formData.password || ""} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                    placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-lg">
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit} disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Spinner size="sm" color="white" /> : <>Create Account →</>}
                </motion.button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-red-400 font-semibold hover:text-red-300">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
