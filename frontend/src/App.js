import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage        from './pages/Login';
import RegisterPage     from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import ProfilePage      from './pages/Profile';

// ── Route guards ──────────────────────────────────────────────────────────────

// Redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirect students away from security dashboard and vice versa
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// ── App ───────────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Student */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Security / Admin */}
      <Route
        path="/security"
        element={
          <PrivateRoute>
            <RoleRoute allowedRoles={['security', 'admin']}>
              <SecurityDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* Profile (all logged-in roles) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
