import { useState } from "react";
import { triggerPanic } from "../../services/alertService";
import { useAuth } from "../../context/AuthContext";
import useLocation from "../../hooks/useLocation";

const PanicButton = () => {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { location, error: locationError } = useLocation();

  const handlePanic = async () => {
    if (locationError || !location) {
      setError("Location unavailable. Please enable GPS and try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await triggerPanic(location, user.token);
      setTriggered(true);
      setTimeout(() => setTriggered(false), 8000);
    } catch {
      setError("Failed to send alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePanic}
        disabled={loading || triggered}
        className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full text-white font-bold text-lg sm:text-xl shadow-2xl transition-all duration-300 active:scale-95 border-4 ${
          triggered
            ? "bg-green-500 border-green-300 scale-95"
            : loading
            ? "bg-orange-500 border-orange-300 opacity-80 cursor-wait"
            : "bg-red-600 border-red-400 hover:bg-red-700 animate-pulse"
        } ${loading || triggered ? "cursor-not-allowed" : ""}`}
      >
        {loading ? "Sending..." : triggered ? "✓ Help Sent!" : "PANIC"}
      </button>

      {triggered && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
          <p className="text-green-700 font-bold text-sm">🚨 Emergency Alert Sent!</p>
          <p className="text-green-600 text-xs mt-1">Security has been notified with your location.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center">
          <p className="text-red-600 text-xs">{error}</p>
        </div>
      )}

      {!triggered && !error && (
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          {location ? "📍 Location ready — Press in case of emergency" : "⏳ Getting your location..."}
        </p>
      )}
    </div>
  );
};
export default PanicButton;
