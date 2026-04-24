import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RoutePlanner from "../pages/RoutePlanner";
import ReportIncident from "../pages/ReportIncident";
import Notifications from "../pages/Notifications";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPanics from "../pages/admin/AdminPanics";
import AdminIncidents from "../pages/admin/AdminIncidents";
import AdminAlerts from "../pages/admin/AdminAlerts";
import AdminUsers from "../pages/admin/AdminUsers";

const AppRoutes = () => (
  <Routes>
    {/* Student Public */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Student Protected */}
    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
    <Route path="/route-planner" element={<PrivateRoute><RoutePlanner /></PrivateRoute>} />
    <Route path="/report" element={<PrivateRoute><ReportIncident /></PrivateRoute>} />
    <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

    {/* Admin/Security */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/admin/panics" element={<AdminRoute><AdminPanics /></AdminRoute>} />
    <Route path="/admin/incidents" element={<AdminRoute><AdminIncidents /></AdminRoute>} />
    <Route path="/admin/alerts" element={<AdminRoute><AdminAlerts /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
  </Routes>
);

export default AppRoutes;
