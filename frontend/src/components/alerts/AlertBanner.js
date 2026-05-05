import { useAlerts } from "../../context/AlertContext";

const AlertBanner = () => {
  const { activeAlert, dismissAlert } = useAlerts();
  if (!activeAlert) return null;

  const styles = {
    critical: "bg-red-600 text-white border-red-400",
    warning:  "bg-yellow-500 text-gray-900 border-yellow-300",
    info:     "bg-blue-600 text-white border-blue-400",
  };

  const icons = { critical: "🚨", warning: "⚠️", info: "ℹ️" };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b-2 shadow-lg ${styles[activeAlert.severity] || styles.info}`}>
      <div className="px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0 animate-bounce">{icons[activeAlert.severity] || "ℹ️"}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">{activeAlert.message}</p>
            {activeAlert.severity === "critical" && (
              <p className="text-xs opacity-80 mt-0.5">Tap to dismiss after reading</p>
            )}
          </div>
        </div>
        <button onClick={() => dismissAlert(activeAlert.id)}
          className="text-2xl font-bold opacity-80 hover:opacity-100 ml-3 shrink-0 leading-none">
          &times;
        </button>
      </div>
    </div>
  );
};
export default AlertBanner;
