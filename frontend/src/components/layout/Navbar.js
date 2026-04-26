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
    <nav className="bg-red-700 text-white px-3 sm:px-4 py-2 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <img src="/images/plasu-logo.png" alt="PLASU" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
        <div className="hidden xs:block">
          <p className="font-bold text-sm leading-tight">PLASU SafeApp</p>
          <p className="text-red-200 text-[10px] leading-tight">Campus Safety</p>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-sm">
        <span className="opacity-80 hidden sm:inline truncate max-w-[120px] text-xs">{user?.name}</span>
        <button onClick={handleLogout}
          className="bg-white text-red-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-50 transition">
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
