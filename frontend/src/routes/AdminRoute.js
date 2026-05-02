import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin" && user.role !== "security") return <Navigate to="/" replace />;
  return children;
};
export default AdminRoute;
