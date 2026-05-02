import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); setLoading(false); return; }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }); setLoading(false); },
      (err) => { setError(err.message); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, loading };
};
export default useLocation;
