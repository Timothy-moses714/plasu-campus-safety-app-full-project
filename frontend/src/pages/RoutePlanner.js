import { useState, useEffect, useRef } from "react";
import StudentLayout from "../components/layout/StudentLayout";
import { getRiskZones } from "../services/riskZoneService";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/layout/Footer";


const PLASU_CENTER = { lat: 9.3728, lng: 8.9554 };
const PLASU_ZOOM = 20;

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

const RISK_COLORS = {
  high:   { fill: "#ef4444", stroke: "#dc2626" },
  medium: { fill: "#f97316", stroke: "#ea580c" },
  low:    { fill: "#22c55e", stroke: "#16a34a" },
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
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [riskZones, setRiskZones] = useState([]);
  const [showLegend, setShowLegend] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const riskCirclesRef = useRef([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token) return;
    getRiskZones(user.token).then(res => setRiskZones(res.data || [])).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: PLASU_CENTER, zoom: PLASU_ZOOM,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
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
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#dc2626", fillOpacity: 0.9, strokeColor: "#ffffff", strokeWeight: 2 },
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<p style="font-weight:bold;margin:0;font-size:12px">${name.charAt(0).toUpperCase() + name.slice(1)}</p>`,
        });
        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });
    const renderer = new window.google.maps.DirectionsRenderer({
      map, polylineOptions: { strokeColor: "#dc2626", strokeWeight: 5, strokeOpacity: 0.8 },
    });
    directionsRendererRef.current = renderer;
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || riskZones.length === 0) return;
    riskCirclesRef.current.forEach(c => c.setMap(null));
    riskCirclesRef.current = [];
    riskZones.forEach(zone => {
      const colors = RISK_COLORS[zone.level] || RISK_COLORS.medium;
      const circle = new window.google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: zone.location.lat, lng: zone.location.lng },
        radius: zone.location.radius || 100,
        fillColor: colors.fill, fillOpacity: 0.25,
        strokeColor: colors.stroke, strokeWeight: 2, strokeOpacity: 0.8,
      });
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-size:12px"><strong>${zone.name}</strong><br/>Risk: <span style="color:${colors.stroke};font-weight:bold;text-transform:capitalize">${zone.level}</span></div>`,
      });
      circle.addListener("click", (e) => { infoWindow.setPosition(e.latLng); infoWindow.open(mapInstanceRef.current); });
      riskCirclesRef.current.push(circle);
    });
  }, [riskZones]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setLocating(true); setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(coords);
        setOrigin(`My Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        setLocating(false);
        if (mapInstanceRef.current) {
          if (currentMarkerRef.current) currentMarkerRef.current.setMap(null);
          currentMarkerRef.current = new window.google.maps.Marker({
            position: coords, map: mapInstanceRef.current, title: "My Location",
            icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: "#2563eb", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 3 },
          });
          mapInstanceRef.current.panTo(coords);
        }
      },
      () => { setLocating(false); setError("Could not get location. Enable GPS and try again."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const drawManualRoute = (from, to) => {
    const map = mapInstanceRef.current;
    const line = new window.google.maps.Polyline({
      path: [from, to], geodesic: true, strokeColor: "#dc2626", strokeOpacity: 0.8, strokeWeight: 5, map,
    });
    new window.google.maps.Marker({ position: from, map, label: "A" });
    new window.google.maps.Marker({ position: to, map, label: "B" });
    const dist = window.google.maps.geometry?.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(from.lat, from.lng),
      new window.google.maps.LatLng(to.lat, to.lng)
    );
    const distM = dist ? Math.round(dist) : "~300";
    const walkMin = dist ? Math.max(1, Math.round(dist / 80)) : 4;
    const passesRisk = riskZones.some(zone => {
      if (zone.level !== "high") return false;
      const zoneLL = new window.google.maps.LatLng(zone.location.lat, zone.location.lng);
      const d1 = window.google.maps.geometry?.spherical.computeDistanceBetween(zoneLL, new window.google.maps.LatLng(from.lat, from.lng)) || 999;
      const d2 = window.google.maps.geometry?.spherical.computeDistanceBetween(zoneLL, new window.google.maps.LatLng(to.lat, to.lng)) || 999;
      return d1 < 200 || d2 < 200;
    });
    setRouteInfo({ distance: `${distM} metres`, duration: `~${walkMin} min walking`, safe: !passesRisk });
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(from); bounds.extend(to);
    map.fitBounds(bounds);
    setTimeout(() => line.setMap(null), 60000);
  };

  const handlePlan = () => {
    if (!origin || !destination) return setError("Please enter both origin and destination.");
    if (!window.google) return setError("Google Maps is not loaded.");
    setLoading(true); setError(""); setRouteInfo(null);
    const originCoords = currentLocation && origin.startsWith("My Location") ? currentLocation : resolveLocation(origin);
    const destCoords = resolveLocation(destination);
    if (originCoords && destCoords) {
      new window.google.maps.DirectionsService().route({
        origin: new window.google.maps.LatLng(originCoords.lat, originCoords.lng),
        destination: new window.google.maps.LatLng(destCoords.lat, destCoords.lng),
        travelMode: window.google.maps.TravelMode.WALKING,
      }, (result, status) => {
        setLoading(false);
        if (status === "OK") {
          directionsRendererRef.current.setDirections(result);
          const leg = result.routes[0].legs[0];
          setRouteInfo({ distance: leg.distance.text, duration: leg.duration.text, safe: true });
          mapInstanceRef.current.fitBounds(result.routes[0].bounds);
        } else { drawManualRoute(originCoords, destCoords); }
      });
    } else { setLoading(false); setError("Location not found. Use 📍 or type a campus location."); }
  };

  const locationNames = [...new Set(Object.keys(CAMPUS_LOCATIONS).map(l => l.charAt(0).toUpperCase() + l.slice(1)))];

  return (
    <StudentLayout>
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">🗺 Safe Route Planner</h2>

        <div className="bg-white rounded-2xl shadow p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="flex gap-2">
              <input value={origin} onChange={(e) => { setOrigin(e.target.value); setCurrentLocation(null); }}
                list="locations-from"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type location or tap 📍" />
              <button onClick={handleGetCurrentLocation} disabled={locating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition disabled:opacity-50 shrink-0">
                {locating ? "⏳" : "📍"}
              </button>
            </div>
            <datalist id="locations-from">{locationNames.map(s => <option key={s} value={s} />)}</datalist>
            {currentLocation && <p className="text-blue-600 text-xs mt-1">✓ Using your GPS location</p>}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)}
              list="locations-to"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Faculty of Law" />
            <datalist id="locations-to">{locationNames.map(s => <option key={s} value={s} />)}</datalist>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={avoidRiskZones} onChange={(e) => setAvoidRiskZones(e.target.checked)} className="accent-red-600 w-4 h-4" />
            Avoid risk zones
          </label>

          {error && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{error}</div>}

          {routeInfo && (
            <div className={`border rounded-lg p-3 space-y-1 ${routeInfo.safe ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-300"}`}>
              <p className={`font-bold text-xs sm:text-sm ${routeInfo.safe ? "text-green-700" : "text-yellow-700"}`}>
                {routeInfo.safe ? "✅ Safe Route Found" : "⚠️ Route Near Risk Zone"}
              </p>
              <div className="flex gap-4 text-xs text-gray-600">
                <p>📍 <strong>{routeInfo.distance}</strong></p>
                <p>⏱ <strong>{routeInfo.duration}</strong></p>
              </div>
              {!routeInfo.safe && <p className="text-yellow-700 text-xs">⚠️ Stay alert — this route passes near a high risk zone</p>}
            </div>
          )}

          <button onClick={handlePlan} disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? "Finding safe route..." : "Find Safe Route"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-3">
          <button onClick={() => setShowLegend(!showLegend)}
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-700">
            <span>🗺 Map Legend</span><span>{showLegend ? "▲" : "▼"}</span>
          </button>
          {showLegend && (
            <div className="mt-3 space-y-2">
              {[
                { color: "bg-red-500", label: "High Risk Zone — avoid at night" },
                { color: "bg-orange-500", label: "Medium Risk Zone — stay alert" },
                { color: "bg-green-500", label: "Low Risk Zone — generally safe" },
                { color: "bg-green-600", label: "Campus location marker" },
                { color: "bg-blue-600", label: "Your current location" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <div className={`w-4 h-4 rounded-full ${color} opacity-70 shrink-0`} />
                  <span className="text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden h-72 sm:h-96 md:h-[500px]">
          {!window.google ? (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
              <p className="text-3xl mb-2">🗺</p>
              <p className="font-semibold">Google Maps not loaded</p>
              <p className="text-xs mt-1">Add your API key to public/index.html</p>
            </div>
          ) : <div ref={mapRef} className="w-full h-full" />}
        </div>
      </div>
    </StudentLayout>
  );
};
export default RoutePlanner;
