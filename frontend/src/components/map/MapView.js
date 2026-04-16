import { useEffect, useRef } from "react";

const MapView = ({ center, markers = [], onMapClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: center || { lat: 9.2833, lng: 8.9833 },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    });
    mapInstanceRef.current = map;

    if (onMapClick) {
      map.addListener("click", (e) => {
        onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
    }

    markers.forEach(({ lat, lng, label, color }) => {
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        label: label || "",
        icon: color ? { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: color, fillOpacity: 1, strokeWeight: 1 } : undefined,
      });
    });
  }, [center, markers]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: "300px" }} />;
};
export default MapView;
