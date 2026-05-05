import { useState } from "react";
import { triggerPanic } from "../../services/alertService";
import { useAuth } from "../../context/AuthContext";
import useLocation from "../../hooks/useLocation";

const PanicButton = () => {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const { user } = useAuth();
  const { location, error: locationError } = useLocation();

  const handlePanic = async () => {
    if (locationError || !location) {
      setError("Location unavailable. Please enable GPS and try again.");
      return;
    }

    // 3 second countdown before sending
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sendPanic();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendPanic = async () => {
    setLoading(true);
    setError("");
    try {
      await triggerPanic(location, user.token);
      setTriggered(true);
      // Vibrate device if supported
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
      setTimeout(() => setTriggered(false), 10000);
    } catch {
      setError("Failed to send alert. Please call security directly.");
    } finally {
      setLoading(false);
    }
  };

  const cancelPanic = () => {
    setCountdown(null);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {countdown !== null ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-orange-500 border-4 border-orange-300 flex items-center justify-center">
            <span className="text-white font-bold text-4xl">{countdown}</span>
          </div>
          <p className="text-orange-600 font-bold text-sm">Sending alert in {countdown}s...</p>
          <button onClick={cancelPanic}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-xl transition text-sm">
            Cancel
          </button>
        </div>
      ) : (
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
      )}

      {triggered && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center w-full max-w-xs">
          <p className="text-green-700 font-bold text-sm">🚨 Emergency Alert Sent!</p>
          <p className="text-green-600 text-xs mt-1">Security notified with your GPS location.</p>
          <p className="text-green-500 text-xs mt-1">Stay calm. Help is on the way.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center w-full max-w-xs">
          <p className="text-red-600 text-xs font-semibold">{error}</p>
          <p className="text-red-500 text-xs mt-1">📞 Call Security: 07012345678</p>
        </div>
      )}

      {!triggered && !error && countdown === null && (
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-xs">
          {location ? "📍 Location ready — Press and hold 3 seconds to send alert" : "⏳ Getting your location..."}
        </p>
      )}
    </div>
  );
};
export default PanicButton;
