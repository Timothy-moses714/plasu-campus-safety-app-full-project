import useRealTimeAlerts from "../hooks/useRealTimeAlerts";

// This component just runs the real-time hook globally
const RealTimeMonitor = () => {
  useRealTimeAlerts();
  return null;
};

export default RealTimeMonitor;
