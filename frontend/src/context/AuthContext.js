import { createContext, useContext, useState, useEffect } from "react";
import UserModel from "../models/User";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ ...UserModel });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("plasu_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("plasu_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser({ ...UserModel });
    setIsAuthenticated(false);
    localStorage.removeItem("plasu_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
