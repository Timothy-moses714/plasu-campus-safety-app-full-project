import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertBanner from "../alerts/AlertBanner";
import { getAlerts } from "../../services/alertService";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/route-planner", label: "Safe Routes", icon: "🗺" },
  { to: "/report", label: "Report Incident", icon: "📋" },
  { to: "/my-incidents", label: "My Reports", icon: "📄" },
  { to: "/notifications", label: "Alerts", icon: "🔔", hasBadge: true },
  { to: "/about", label: "About", icon: "ℹ️" },
  { to: "/profile", label: "My Profile", icon: "👤" },
];

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (!user?.token) return;
    const fetchAlerts = async () => {
      try {
        const res = await getAlerts(user.token);
        const data = res.data || res;
        setAlertCount(Array.isArray(data) ? data.length : 0);
      } catch { setAlertCount(0); }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <AlertBanner />

      {/* ── DESKTOP SIDEBAR (fixed, only visible md+) ── */}
      <aside style={{
        width: "256px", backgroundColor: "#111827", display: "flex",
        flexDirection: "column", position: "fixed", top: 0, left: 0,
        height: "100vh", zIndex: 30, overflowY: "auto"
      }} className="hidden md:flex">
        <div style={{ position: "relative", height: "144px", overflow: "hidden", flexShrink: 0 }}>
          <img src="/images/campus-gate.jpg" alt="PLASU" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, #111827)", opacity: 0.9 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/images/plasu-logo.png" alt="PLASU"
              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "50%", background: "white", padding: "2px", border: "2px solid #ef4444" }} />
            <div>
              <p style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>PLASU SafeApp</p>
              <p style={{ color: "#9ca3af", fontSize: "12px" }}>Campus Safety</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1f2937", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", backgroundColor: "#dc2626", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #ef4444" }}>
              {user?.profilePicture
                ? <img src={user.profilePicture} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>{user?.name?.[0]}</span>
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "white", fontWeight: "600", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
              <p style={{ color: "#9ca3af", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.matricNumber}</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px", overflowY: "auto" }}>
          {navItems.map(({ to, icon, label, hasBadge }) => (
            <NavLink key={to} to={to} end={to === "/"}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "12px", marginBottom: "4px",
                textDecoration: "none", fontSize: "14px", fontWeight: "500",
                backgroundColor: isActive ? "#dc2626" : "transparent",
                color: isActive ? "white" : "#9ca3af",
              })}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {hasBadge && alertCount > 0 && (
                <span style={{ backgroundColor: "#ef4444", color: "white", fontSize: "11px", fontWeight: "bold", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #1f2937", flexShrink: 0 }}>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", border: "none", backgroundColor: "transparent", color: "#9ca3af", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
            <span style={{ fontSize: "18px" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden" style={{ position: "fixed", top: 0, left: 0, width: "100%", backgroundColor: "#111827", borderBottom: "1px solid #1f2937", zIndex: 40, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/images/plasu-logo.png" alt="PLASU" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "50%", background: "white", padding: "2px" }} />
          <p style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>PLASU SafeApp</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "white", fontSize: "12px", opacity: 0.7 }}>{user?.name?.split(" ")[0]}</span>
          <button onClick={handleLogout} style={{ color: "#9ca3af", fontSize: "12px", border: "1px solid #374151", padding: "4px 8px", borderRadius: "8px", background: "none", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, width: "100%", backgroundColor: "#111827", borderTop: "1px solid #1f2937", zIndex: 40, display: "flex", justifyContent: "space-around", padding: "4px 0" }}>
        {navItems.slice(0, 5).map(({ to, icon, label, hasBadge }) => (
          <NavLink key={to} to={to} end={to === "/"}
            style={({ isActive }) => ({
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              padding: "4px 8px", borderRadius: "8px", textDecoration: "none",
              color: isActive ? "#f87171" : "#6b7280", fontWeight: isActive ? "bold" : "normal",
            })}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: "20px" }}>{icon}</span>
              {hasBadge && alertCount > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", backgroundColor: "#ef4444", color: "white", fontSize: "9px", fontWeight: "bold", width: "14px", height: "14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: "9px" }}>{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── MAIN CONTENT ──
          KEY FIX: Use paddingTop/paddingBottom to push content away from fixed bars
          NOT margin or position tricks — just simple padding on a normal flow div
      ── */}
      <div style={{ flex: 1, marginLeft: "0px", paddingTop: "56px", paddingBottom: "72px" }}
        className="md:ml-64 md:pt-0 md:pb-0">
        {children}
      </div>
    </div>
  );
};
export default StudentLayout;
