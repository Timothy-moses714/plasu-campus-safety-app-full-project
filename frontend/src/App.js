import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import AppRoutes from "./routes/AppRoutes";
import RealTimeMonitor from "./components/RealTimeMonitor";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AlertProvider>
        <RealTimeMonitor />
        <AppRoutes />
      </AlertProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
