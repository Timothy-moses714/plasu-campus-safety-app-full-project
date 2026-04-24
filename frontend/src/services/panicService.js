const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getPanicAlerts = async (token) => {
  const res = await fetch(`${BASE_URL}/alerts/panics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch panic alerts");
  return res.json();
};

export const updatePanicStatus = async (id, status, token) => {
  const res = await fetch(`${BASE_URL}/alerts/panics/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update panic status");
  return res.json();
};
