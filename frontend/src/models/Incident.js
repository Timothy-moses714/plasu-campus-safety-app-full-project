const IncidentModel = {
  id: null,
  title: "",
  description: "",
  type: "", // "theft" | "assault" | "suspicious_activity" | "fire" | "other"
  location: { lat: null, lng: null, address: "" },
  reportedBy: null,
  reportedAt: null,
  status: "pending", // "pending" | "acknowledged" | "resolved"
  mediaUrl: null,
};

export default IncidentModel;
