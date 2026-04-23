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
    <nav className="bg-red-700 text-white px-3 sm:px-4 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2 font-bold text-base sm:text-lg truncate">
        <span>🛡</span>
        <span className="hidden xs:inline">PLASU SafeApp</span>
        <span className="xs:hidden">SafeApp</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4 text-sm">
        <span className="opacity-80 hidden sm:inline truncate max-w-[120px]">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-red-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
