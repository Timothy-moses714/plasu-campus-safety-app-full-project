const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getRiskZones = async (token) => {
  const res = await fetch(`${BASE_URL}/riskzones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch risk zones");
  return res.json();
};

export const classifyZone = async (zoneData, token) => {
  const res = await fetch(`${BASE_URL}/riskzones/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(zoneData),
  });
  if (!res.ok) throw new Error("Classification failed");
  return res.json();
};

export const autoClassifyAll = async (token) => {
  const res = await fetch(`${BASE_URL}/riskzones/auto-classify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Auto-classification failed");
  return res.json();
};

export const deleteRiskZone = async (id, token) => {
  const res = await fetch(`${BASE_URL}/riskzones/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete risk zone");
  return res.json();
};
