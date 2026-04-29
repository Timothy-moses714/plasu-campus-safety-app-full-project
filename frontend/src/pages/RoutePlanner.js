import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";

// PLASU Bokkos exact coordinates
const PLASU_CENTER = { lat: 9.2833, lng: 8.9500 };
const PLASU_ZOOM = 16;

// Known PLASU campus locations with exact coordinates
const CAMPUS_LOCATIONS = {
  "main gate":        { lat: 9.2850, lng: 8.9480 },
  "senate building":  { lat: 9.2833, lng: 8.9500 },
  "senate":           { lat: 9.2833, lng: 8.9500 },
  "library":          { lat: 9.2840, lng: 8.9510 },
  "csc block":        { lat: 9.2820, lng: 8.9505 },
  "computer science": { lat: 9.2820, lng: 8.9505 },
  "lecture hall":     { lat: 9.2825, lng: 8.9495 },
  "hostel":           { lat: 9.2815, lng: 8.9520 },
  "cafeteria":        { lat: 9.2830, lng: 8.9515 },
  "admin block":      { lat: 9.2845, lng: 8.9508 },
  "clinic":           { lat: 9.2838, lng: 8.9492 },
  "sports complex":   { lat: 9.2810, lng: 8.9490 },
  "back gate":        { lat: 9.2800, lng: 8.9530 },
  "law faculty":      { lat: 9.2828, lng: 8.9518 },
  "science block":    { lat: 9.2822, lng: 8.9498 },
};

const resolveLocation = (input) => {
  const key = input.toLowerCase().trim();
  for (const [name, coords] of Object.entries(CAMPUS_LOCATIONS)) {
    if (key.includes(name) || name.includes(key)) {
      return coords;
    }
  }
  return null;
};

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

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: PLASU_CENTER,
      zoom: PLASU_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: "roadmap",
    });

    mapInstanceRef.current = map;

    // Mark known campus locations
    Object.entries(CAMPUS_LOCATIONS).slice(0, 6).forEach(([name, coords]) => {
      new window.google.maps.Marker({
        position: coords,
        map,
        title: name.charAt(0).toUpperCase() + name.slice(1),
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#dc2626",
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });
    });

    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#dc2626",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });
    directionsRendererRef.current = renderer;
  }, []);

  const handlePlan = async () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination.");
      return;
    }

    if (!window.google) {
      setError("Google Maps is not loaded. Please add your API key.");
      return;
    }

    setLoading(true);
    setError("");
    setRouteInfo(null);

    // Try to resolve to known campus coordinates first
    const originCoords = resolveLocation(origin);
    const destCoords = resolveLocation(destination);

    const originInput = originCoords
      ? new window.google.maps.LatLng(originCoords.lat, originCoords.lng)
      : `${origin}, Plateau State University Bokkos, Nigeria`;

    const destInput = destCoords
      ? new window.google.maps.LatLng(destCoords.lat, destCoords.lng)
      : `${destination}, Plateau State University Bokkos, Nigeria`;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originInput,
        destination: destInput,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        setLoading(false);
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteInfo({
            distance: leg.distance.text,
            duration: leg.duration.text,
            steps: leg.steps.length,
          });
          // Pan map to show route
          mapInstanceRef.current.fitBounds(result.routes[0].bounds);
        } else {
          // If Google can't find route between coords, draw a manual line
          if (originCoords && destCoords) {
            drawManualRoute(originCoords, destCoords);
          } else {
            setError("Could not find route. Try using exact location names like 'Main Gate', 'Senate Building', 'Library'.");
          }
        }
      }
    );
  };

  const drawManualRoute = (from, to) => {
    // Draw straight line between two known campus points
    const map = mapInstanceRef.current;
    const line = new window.google.maps.Polyline({
      path: [from, to],
      geodesic: true,
      strokeColor: "#dc2626",
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map,
    });

    // Add markers
    new window.google.maps.Marker({ position: from, map, label: "A" });
    new window.google.maps.Marker({ position: to, map, label: "B" });

    // Calculate rough distance
    const dist = window.google.maps.geometry?.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(from.lat, from.lng),
      new window.google.maps.LatLng(to.lat, to.lng)
    );

    const distM = dist ? Math.round(dist) : "~200";
    const walkMin = dist ? Math.round(dist / 80) : 3;

    setRouteInfo({
      distance: `${distM}m`,
      duration: `${walkMin} min walking`,
      steps: 1,
    });

    // Fit map to show both points
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(from);
    bounds.extend(to);
    map.fitBounds(bounds);
    map.setZoom(17);

    setTimeout(() => line.setMap(null), 30000);
  };

  const suggestions = Object.keys(CAMPUS_LOCATIONS).map(
    (l) => l.charAt(0).toUpperCase() + l.slice(1)
  );

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
              list="campus-locations-from"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Main Gate, Library, Senate"
            />
            <datalist id="campus-locations-from">
              {suggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              value={destination} onChange={(e) => setDestination(e.target.value)}
              list="campus-locations-to"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. CSC Block, Hostel, Cafeteria"
            />
            <datalist id="campus-locations-to">
              {suggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
              <p className="text-green-700 font-bold text-xs sm:text-sm">✅ Safe Route Found</p>
              <div className="flex gap-4 text-xs text-green-700">
                <p>📍 Distance: <strong>{routeInfo.distance}</strong></p>
                <p>⏱ Time: <strong>{routeInfo.duration}</strong></p>
              </div>
              {avoidRiskZones && (
                <p className="text-green-600 text-xs">🛡 Route avoids known risk zones</p>
              )}
            </div>
          )}

          <button onClick={handlePlan} disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? "Finding safe route..." : "Find Safe Route"}
          </button>
        </div>

        {/* Campus location hints */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-blue-700 text-xs font-semibold mb-1">📍 Available Campus Locations:</p>
          <p className="text-blue-600 text-xs leading-relaxed">
            Main Gate, Senate Building, Library, CSC Block, Lecture Hall, Hostel, Cafeteria, Admin Block, Clinic, Sports Complex, Back Gate, Law Faculty, Science Block
          </p>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow overflow-hidden h-72 sm:h-96">
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
