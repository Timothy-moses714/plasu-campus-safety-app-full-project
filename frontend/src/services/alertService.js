const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getAlerts = async (token) => {
  const res = await fetch(`${BASE_URL}/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
};

export const triggerPanic = async (location, token) => {
  const res = await fetch(`${BASE_URL}/alerts/panic`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ location }),
  });
  if (!res.ok) throw new Error("Panic alert failed");
  return res.json();
};

export const createAlert = async (alertData, token) => {
  const res = await fetch(`${BASE_URL}/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(alertData),
  });
  if (!res.ok) throw new Error("Failed to create alert");
  return res.json();
};

export const deactivateAlert = async (id, token) => {
  const res = await fetch(`${BASE_URL}/alerts/${id}/deactivate`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to deactivate alert");
  return res.json();
};
