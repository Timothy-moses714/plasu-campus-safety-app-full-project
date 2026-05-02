import { useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import { getPanicAlerts } from "../services/panicService";

const useRealTimeAlerts = () => {
  const { user, isAuthenticated } = useAuth();
  const { addAlert } = useAlerts();

  const checkForNewPanics = useCallback(async () => {
    if (!isAuthenticated || !user?.token) return;
    if (user.role !== "admin" && user.role !== "security") return;
    try {
      const res = await getPanicAlerts(user.token);
      const panics = (res.data || []).filter(p => p.status === "active");
      if (panics.length > 0) {
        const latest = panics[0];
        const lastChecked = localStorage.getItem("last_panic_check");
        const latestTime = new Date(latest.createdAt).getTime();
        if (!lastChecked || latestTime > parseInt(lastChecked)) {
          addAlert({ id: latest._id, message: `🚨 PANIC from ${latest.triggeredBy?.name || "Unknown"} — ${latest.triggeredBy?.phone || ""}`, severity: "critical", issuedAt: latest.createdAt });
          localStorage.setItem("last_panic_check", latestTime.toString());
        }
      }
    } catch (err) { console.error("Real-time check error:", err); }
  }, [isAuthenticated, user, addAlert]);

  useEffect(() => {
    if (!isAuthenticated) return;
    checkForNewPanics();
    const interval = setInterval(checkForNewPanics, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, checkForNewPanics]);
};
export default useRealTimeAlerts;
