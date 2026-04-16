const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const reportIncident = async (incidentData, token) => {
  const res = await fetch(`${BASE_URL}/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(incidentData),
  });
  if (!res.ok) throw new Error("Failed to report incident");
  return res.json();
};

export const getIncidents = async (token) => {
  const res = await fetch(`${BASE_URL}/incidents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
};

export const updateIncidentStatus = async (id, status, token) => {
  const res = await fetch(`${BASE_URL}/incidents/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update incident");
  return res.json();
};
