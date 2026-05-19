import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner";
import { motion } from "framer-motion";
import Footer from "../components/layout/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Slideshow images
  const images = [
    "/images/campus-gate.jpg",
    "/images/campus-gate-2.jpg",
    "/images/campus-main.jpg",
    "/images/plasu-gate-2.jpg",
    "/images/security-officers.jpg",
    "/images/security-desk.jpg",
    "/images/uni-block.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Please enter your email and password.");
    }

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
  <div className="min-h-screen flex flex-col">

    {/* MAIN CONTENT */}
    <div className="flex flex-1">

      {/* LEFT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >

        {/* Slideshow */}
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute bottom-0 p-10 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
              Your campus safety companion. Emergency alerts,
              safe routes and incident reporting — all in one place.
            </p>

            <div className="flex gap-4 mt-6">
              {["🛡", "🗺", "📋"].map((icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center border border-white/30"
                >
                  <p className="text-white text-lg">{icon}</p>

                  <p className="text-gray-200 text-xs mt-1">
                    {i === 0 && "Emergency Alerts"}
                    {i === 1 && "Safe Routes"}
                    {i === 2 && "Report Incidents"}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img
              src="/images/plasu-logo.png"
              alt="PLASU Logo"
              className="w-14 h-14 object-contain rounded-full bg-red-600 p-1.5"
            />

            <div>
              <h1 className="text-xl font-bold text-white">
                PLASU SafeApp
              </h1>

              <p className="text-xs text-gray-400">
                Campus Safety System
              </p>
            </div>
          </div>

          {/* Desktop Heading */}
          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-white">
              Sign In
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Access your student safety portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="you@plasu.edu.ng"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-gray-300">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-red-400"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>Sign In →</>
              )}
            </motion.button>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-red-400 font-semibold"
            >
              Create Account
            </Link>
          </p>

          {/* Admin Portal */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-center text-xs text-gray-600 mb-3">
              Staff or Security Officer?
            </p>

            <Link
              to="/admin/login"
              className="flex justify-center items-center gap-2 w-full border border-gray-700 hover:border-red-600 hover:bg-gray-800 text-gray-400 hover:text-red-400 text-sm font-semibold py-3 rounded-xl"
            >
              🛡 Admin / Security Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>

    {/* FOOTER */}
    <Footer />

   </div>
  );
};

export default Login;