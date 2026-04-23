import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/common/Button";
import RouteRequestModel from "../models/RouteRequest";

const RoutePlanner = () => {
  const [form, setForm] = useState({ ...RouteRequestModel });
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handlePlan = () => {
    if (!origin || !destination) return alert("Please enter both origin and destination.");
    alert(`Planning safe route from "${origin}" to "${destination}"`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 space-y-4 sm:space-y-5 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">🗺 Safe Route Planner</h2>
        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              value={origin} onChange={(e) => setOrigin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Main Gate"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              value={destination} onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. CSC Block"
            />
          </div>
          <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox" checked={form.avoidRiskZones}
              onChange={(e) => setForm((p) => ({ ...p, avoidRiskZones: e.target.checked }))}
              className="accent-red-600 w-4 h-4"
            />
            Avoid risk zones
          </label>
          <Button onClick={handlePlan} fullWidth size="lg">Find Safe Route</Button>
        </div>

        {/* Map placeholder - responsive height */}
        <div className="bg-white rounded-2xl shadow overflow-hidden h-64 sm:h-80 md:h-96">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            🗺 Map will render here (Google Maps API)
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default RoutePlanner;
