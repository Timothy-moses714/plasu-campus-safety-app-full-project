import { useEffect } from "react";

const RISK_ZONES = [
  { lat: 9.284, lng: 8.982, radius: 150, level: "high", label: "High Risk Zone" },
  { lat: 9.281, lng: 8.985, radius: 100, level: "medium", label: "Medium Risk Zone" },
];

const RiskZoneOverlay = ({ map }) => {
  useEffect(() => {
    if (!map || !window.google) return;
    const circles = RISK_ZONES.map((zone) =>
      new window.google.maps.Circle({
        map,
        center: { lat: zone.lat, lng: zone.lng },
        radius: zone.radius,
        fillColor: zone.level === "high" ? "#ef4444" : "#f97316",
        fillOpacity: 0.25,
        strokeColor: zone.level === "high" ? "#dc2626" : "#ea580c",
        strokeWeight: 2,
      })
    );
    return () => circles.forEach((c) => c.setMap(null));
  }, [map]);

  return null;
};
export default RiskZoneOverlay;
