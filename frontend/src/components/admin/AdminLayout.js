import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", icon: "📊", label: "Overview" },
  { to: "/admin/panics",    icon: "🚨", label: "Panic Alerts" },
  { to: "/admin/incidents", icon: "📋", label: "Incidents" },
  { to: "/admin/alerts",    icon: "📢", label: "Campus Alerts" },
  { to: "/admin/riskzones", icon: "🤖", label: "ML Risk Zones" },
  { to: "/admin/users",     icon: "👥", label: "Users" },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#111827" }}>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        width: "256px", backgroundColor: "#1f2937", borderRight: "1px solid #374151",
        display: "flex", flexDirection: "column", position: "fixed",
        top: 0, left: 0, height: "100vh", zIndex: 30, overflowY: "auto"
      }} className="hidden md:flex">
        <div style={{ position: "relative", height: "128px", overflow: "hidden", flexShrink: 0 }}>
          <img src="/images/campus-gate-2.jpg" alt="PLASU" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(17,24,39,0.7)", display: "flex", alignItems: "center", padding: "16px", gap: "12px" }}>
            <img src="/images/plasu-logo.png" alt="PLASU"
              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "50%", background: "white", padding: "2px", flexShrink: 0 }} />
            <div>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>PLASU SafeApp</p>
              <p style={{ color: "#d1d5db", fontSize: "12px", textTransform: "capitalize" }}>{user?.role} Portal</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "12px", marginBottom: "4px",
                textDecoration: "none", fontSize: "14px", fontWeight: "500",
                backgroundColor: isActive ? "#dc2626" : "transparent",
                color: isActive ? "white" : "#9ca3af",
              })}>
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #374151", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#dc2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}>
              {user?.name?.[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "white", fontSize: "12px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
              <p style={{ color: "#9ca3af", fontSize: "12px", textTransform: "capitalize" }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: "100%", backgroundColor: "#374151", color: "#d1d5db", fontSize: "14px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden" style={{ position: "fixed", top: 0, left: 0, width: "100%", backgroundColor: "#1f2937", borderBottom: "1px solid #374151", zIndex: 40, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/images/plasu-logo.png" alt="PLASU" style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "50%", background: "white", padding: "2px" }} />
          <p style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>Admin Portal</p>
        </div>
        <button onClick={handleLogout} style={{ color: "#9ca3af", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "#1f2937", borderTop: "1px solid #374151", zIndex: 40, display: "flex", justifyContent: "space-around", padding: "4px 0" }}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => ({
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              padding: "4px 2px", textDecoration: "none", fontSize: "9px",
              color: isActive ? "#f87171" : "#6b7280", fontWeight: isActive ? "bold" : "normal",
            })}>
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <span>{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, paddingTop: "56px", paddingBottom: "72px" }}
        className="md:ml-64 md:pt-0 md:pb-0">
        <div style={{ padding: "16px" }} className="sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
