import { useState } from "react";
import { triggerPanic } from "../../services/alertService";
import { useAuth } from "../../context/AuthContext";
import useLocation from "../../hooks/useLocation";

const PanicButton = () => {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { location } = useLocation();

  const handlePanic = async () => {
    if (!location) return alert("Location unavailable. Please enable GPS.");
    setLoading(true);
    try {
      await triggerPanic(location, user.token);
      setTriggered(true);
      setTimeout(() => setTriggered(false), 5000);
    } catch {
      alert("Failed to send panic alert. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handlePanic}
        disabled={loading || triggered}
        className={`w-40 h-40 rounded-full text-white font-bold text-xl shadow-2xl transition-all duration-300 active:scale-95 ${
          triggered ? "bg-green-500 scale-95" : "bg-red-600 hover:bg-red-700 animate-pulse"
        }`}
      >
        {loading ? "Sending..." : triggered ? "Help Sent!" : "PANIC"}
      </button>
      <p className="text-sm text-gray-500 text-center">
        {triggered ? "Security has been notified." : "Press in case of emergency"}
      </p>
    </div>
  );
};
export default PanicButton;
