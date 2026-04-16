import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
