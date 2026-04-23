import { useAlerts } from "../../context/AlertContext";

const AlertBanner = () => {
  const { activeAlert, dismissAlert } = useAlerts();
  if (!activeAlert) return null;

  const colors = {
    critical: "bg-red-600 text-white",
    warning: "bg-yellow-400 text-gray-900",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shadow-lg ${colors[activeAlert.severity]}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg sm:text-xl font-bold shrink-0">⚠</span>
        <span className="font-semibold text-xs sm:text-sm truncate">{activeAlert.message}</span>
      </div>
      <button
        onClick={() => dismissAlert(activeAlert.id)}
        className="text-xl font-bold opacity-80 hover:opacity-100 ml-2 shrink-0"
      >
        &times;
      </button>
    </div>
  );
};
export default AlertBanner;
