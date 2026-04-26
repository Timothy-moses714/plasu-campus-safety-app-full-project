const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const USE_MOCK = true;

const MOCK_INCIDENTS = [
  {
    id: "inc-001",
    title: "Bag snatching near Cafeteria",
    type: "theft",
    description: "A student's bag was snatched near the cafeteria around 7PM.",
    status: "acknowledged",
    reportedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "inc-002",
    title: "Unknown persons at back gate",
    type: "suspicious_activity",
    description: "Two unknown persons seen loitering near the back gate.",
    status: "pending",
    reportedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export const reportIncident = async (incidentData, token) => {
  if (USE_MOCK) {
    console.log("MOCK: Incident reported", incidentData);
    return { ...incidentData, id: "mock-inc-" + Date.now(), status: "pending" };
  }
  const res = await fetch(`${BASE_URL}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(incidentData),
  });
  if (!res.ok) throw new Error("Failed to report incident");
  return res.json();
};

export const getIncidents = async (token) => {
  if (USE_MOCK) return MOCK_INCIDENTS;
  const res = await fetch(`${BASE_URL}/incidents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
};

export const updateIncidentStatus = async (id, status, token) => {
  if (USE_MOCK) return { id, status };
  const res = await fetch(`${BASE_URL}/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update incident");
  return res.json();
};
