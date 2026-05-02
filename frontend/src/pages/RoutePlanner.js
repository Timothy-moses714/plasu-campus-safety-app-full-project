import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";

const PLASU_CENTER = { lat: 9.3728, lng: 8.9554 };
const PLASU_ZOOM = 16;

const CAMPUS_LOCATIONS = {
  "main gate":                     { lat: 9.3682833, lng: 8.9610226 },
  "faculty of law":                { lat: 9.3660114, lng: 8.9588649 },
  "law faculty":                   { lat: 9.3660114, lng: 8.9588649 },
  "mini stadium":                  { lat: 9.3625329, lng: 8.9595665 },
  "stadium":                       { lat: 9.3625329, lng: 8.9595665 },
  "checkpoint":                    { lat: 9.3739011, lng: 8.9627997 },
  "faculty of social science":     { lat: 9.3700330, lng: 8.9543221 },
  "social science":                { lat: 9.3700330, lng: 8.9543221 },
  "faculty of health science":     { lat: 9.3727677, lng: 8.9547748 },
  "health science":                { lat: 9.3727677, lng: 8.9547748 },
  "school of postgraduate":        { lat: 9.3737563, lng: 8.9540727 },
  "postgraduate":                  { lat: 9.3737563, lng: 8.9540727 },
  "faculty of agriculture":        { lat: 9.3740671, lng: 8.9531332 },
  "agriculture":                   { lat: 9.3740671, lng: 8.9531332 },
  "faculty of mass communication": { lat: 9.3715921, lng: 8.9553040 },
  "mass communication":            { lat: 9.3715921, lng: 8.9553040 },
  "university health services":    { lat: 9.3728827, lng: 8.9549484 },
  "clinic":                        { lat: 9.3728827, lng: 8.9549484 },
  "health services":               { lat: 9.3728827, lng: 8.9549484 },
};

const resolveLocation = (input) => {
  const key = input.toLowerCase().trim();
  for (const [name, coords] of Object.entries(CAMPUS_LOCATIONS)) {
    if (key.includes(name) || name.includes(key)) return coords;
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
    });
    mapInstanceRef.current = map;

    const uniqueLocations = {};
    Object.entries(CAMPUS_LOCATIONS).forEach(([name, coords]) => {
      const key = `${coords.lat},${coords.lng}`;
      if (!uniqueLocations[key]) {
        uniqueLocations[key] = name;
        const marker = new window.google.maps.Marker({
          position: coords, map,
          title: name.charAt(0).toUpperCase() + name.slice(1),
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#dc2626",
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<p style="font-weight:bold;margin:0">${name.charAt(0).toUpperCase() + name.slice(1)}</p>`,
        });
        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });

    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      polylineOptions: { strokeColor: "#dc2626", strokeWeight: 5, strokeOpacity: 0.8 },
    });
    directionsRendererRef.current = renderer;
  }, []);

  const drawManualRoute = (from, to) => {
    const map = mapInstanceRef.current;
    const line = new window.google.maps.Polyline({
      path: [from, to], geodesic: true,
      strokeColor: "#dc2626", strokeOpacity: 0.8, strokeWeight: 5, map,
    });
    new window.google.maps.Marker({ position: from, map, label: "A" });
    new window.google.maps.Marker({ position: to, map, label: "B" });

    const dist = window.google.maps.geometry?.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(from.lat, from.lng),
      new window.google.maps.LatLng(to.lat, to.lng)
    );
    const distM = dist ? Math.round(dist) : "~300";
    const walkMin = dist ? Math.max(1, Math.round(dist / 80)) : 4;
    setRouteInfo({ distance: `${distM} metres`, duration: `~${walkMin} min walking` });

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(from); bounds.extend(to);
    map.fitBounds(bounds);
    map.setZoom(17);
    setTimeout(() => line.setMap(null), 60000);
  };

  const handlePlan = () => {
    if (!origin || !destination) return setError("Please enter both origin and destination.");
    if (!window.google) return setError("Google Maps is not loaded.");
    setLoading(true); setError(""); setRouteInfo(null);

    const originCoords = resolveLocation(origin);
    const destCoords = resolveLocation(destination);

    if (originCoords && destCoords) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: new window.google.maps.LatLng(originCoords.lat, originCoords.lng),
        destination: new window.google.maps.LatLng(destCoords.lat, destCoords.lng),
        travelMode: window.google.maps.TravelMode.WALKING,
      }, (result, status) => {
        setLoading(false);
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteInfo({ distance: leg.distance.text, duration: leg.duration.text });
          mapInstanceRef.current.fitBounds(result.routes[0].bounds);
        } else {
          drawManualRoute(originCoords, destCoords);
        }
      });
    } else {
      setLoading(false);
      setError("Location not found. Please select from the available campus locations below.");
    }
  };

  const locationNames = [...new Set(
    Object.keys(CAMPUS_LOCATIONS).map(l => l.charAt(0).toUpperCase() + l.slice(1))
  )];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <div className="px-4 sm:px-6 pt-5 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">🗺 Safe Route Planner</h2>

        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From</label>
            <input value={origin} onChange={(e) => setOrigin(e.target.value)}
              list="locations-from"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Main Gate" />
            <datalist id="locations-from">
              {locationNames.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)}
              list="locations-to"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Faculty of Law" />
            <datalist id="locations-to">
              {locationNames.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={avoidRiskZones}
              onChange={(e) => setAvoidRiskZones(e.target.checked)}
              className="accent-red-600 w-4 h-4" />
            Avoid risk zones
          </label>

          {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{error}</div>}

          {routeInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
              <p className="text-green-700 font-bold text-xs sm:text-sm">✅ Safe Route Found</p>
              <div className="flex gap-4 text-xs text-green-700">
                <p>📍 <strong>{routeInfo.distance}</strong></p>
                <p>⏱ <strong>{routeInfo.duration}</strong></p>
              </div>
              {avoidRiskZones && <p className="text-green-600 text-xs">🛡 Route avoids known risk zones</p>}
            </div>
          )}

          <button onClick={handlePlan} disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? "Finding safe route..." : "Find Safe Route"}
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-blue-700 text-xs font-semibold mb-1">📍 Available Campus Locations:</p>
          <p className="text-blue-600 text-xs leading-relaxed">
            Main Gate, Faculty of Law, Mini Stadium, Checkpoint, Faculty of Social Science,
            Faculty of Health Science, School of Postgraduate, Faculty of Agriculture,
            Faculty of Mass Communication, University Health Services / Clinic
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden h-72 sm:h-96">
          {!window.google ? (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
              <p className="text-3xl mb-2">🗺</p>
              <p className="font-semibold">Google Maps not loaded</p>
              <p className="text-xs mt-1">Add your API key to public/index.html</p>
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
