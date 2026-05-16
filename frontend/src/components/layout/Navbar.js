import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="/images/plasu-logo.png" alt="PLASU"
          className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
        <span className="text-white font-bold text-sm">PLASU SafeApp</span>
      </Link>
      {user && (
        <span className="text-gray-400 text-xs">{user.name?.split(" ")[0]}</span>
      )}
    </nav>
  );
};
export default Navbar;
