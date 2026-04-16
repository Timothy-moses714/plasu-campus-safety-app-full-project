const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getSafeRoute = async (routeRequest, token) => {
  const res = await fetch(`${BASE_URL}/routes/safe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(routeRequest),
  });
  if (!res.ok) throw new Error("Failed to get safe route");
  return res.json();
};

export const getRiskZones = async (token) => {
  const res = await fetch(`${BASE_URL}/routes/risk-zones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch risk zones");
  return res.json();
};
