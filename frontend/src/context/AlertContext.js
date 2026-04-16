import { createContext, useContext, useState } from "react";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);

  const addAlert = (alert) => {
    setAlerts((prev) => [alert, ...prev]);
    if (alert.severity === "critical") setActiveAlert(alert);
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (activeAlert?.id === id) setActiveAlert(null);
  };

  const clearAll = () => {
    setAlerts([]);
    setActiveAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alerts, activeAlert, addAlert, dismissAlert, clearAll }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
export default AlertContext;
