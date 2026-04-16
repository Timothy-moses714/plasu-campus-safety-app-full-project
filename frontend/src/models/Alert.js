const AlertModel = {
  id: null,
  message: "",
  severity: "info", // "info" | "warning" | "critical"
  location: { lat: null, lng: null },
  issuedBy: null,
  issuedAt: null,
  expiresAt: null,
  isActive: true,
};

export default AlertModel;
