import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-red-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg">
        <span>🛡</span> PLASU SafeApp
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span className="opacity-80">{user?.name || "User"}</span>
        <button onClick={handleLogout} className="bg-white text-red-700 px-3 py-1 rounded-lg font-semibold hover:bg-red-50 transition">
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
