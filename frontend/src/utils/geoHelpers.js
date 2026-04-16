export const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const isNearCampus = (lat, lng) => {
  // PLASU Bokkos approximate coordinates
  const CAMPUS_LAT = 9.2833;
  const CAMPUS_LNG = 8.9833;
  const RADIUS_KM = 2;
  return getDistanceKm(lat, lng, CAMPUS_LAT, CAMPUS_LNG) <= RADIUS_KM;
};

export const formatCoords = (lat, lng) =>
  `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
