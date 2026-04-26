import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import Button from "../components/common/Button";

const PLASU_CENTER = { lat: 9.2833, lng: 8.9833 };

const RoutePlanner = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [avoidRiskZones, setAvoidRiskZones] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Initialize Google Map
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: PLASU_CENTER,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: { strokeColor: "#dc2626", strokeWeight: 5 },
    });
    directionsRendererRef.current = renderer;
  }, []);

  const handlePlan = async () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination.");
      return;
    }

    if (!window.google) {
      setError("Google Maps is not loaded. Please add your API key to public/index.html");
      return;
    }

    setLoading(true);
    setError("");
    setRouteInfo(null);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: `${origin}, Bokkos, Plateau State, Nigeria`,
        destination: `${destination}, Bokkos, Plateau State, Nigeria`,
        travelMode: window.google.maps.TravelMode.WALKING,
        avoidHighways: avoidRiskZones,
      },
      (result, status) => {
        setLoading(false);
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
          });
        } else {
          setError("Could not find a route. Try different locations.");
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 pt-5 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">🗺 Safe Route Planner</h2>

        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              value={origin} onChange={(e) => setOrigin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Main Gate, Library"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              value={destination} onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. CSC Block, Senate Building"
            />
          </div>
          <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={avoidRiskZones}
              onChange={(e) => setAvoidRiskZones(e.target.checked)}
              className="accent-red-600 w-4 h-4" />
            Avoid risk zones
          </label>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{error}</div>
          )}

          {routeInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-4 text-xs">
              <p className="text-green-700">📍 <strong>{routeInfo.distance}</strong></p>
              <p className="text-green-700">⏱ <strong>{routeInfo.duration}</strong> walking</p>
            </div>
          )}

          <Button onClick={handlePlan} fullWidth disabled={loading}>
            {loading ? "Finding route..." : "Find Safe Route"}
          </Button>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow overflow-hidden h-64 sm:h-80 md:h-96">
          {!window.google ? (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
              <p className="text-3xl mb-2">🗺</p>
              <p className="font-semibold">Google Maps not loaded</p>
              <p className="text-xs mt-1">Add your Google Maps API key to <strong>public/index.html</strong></p>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
export default RoutePlanner;
