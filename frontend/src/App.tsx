import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./components/auth";
import Navbar from "./components/Navbar";
import ContactPage from "./pages/ContactPage";
import DogsPage from "./pages/DogsPage";
import ShelterDashboardPage from "./pages/ShelterDashboardPage";
import ShelterLoginPage from "./pages/ShelterLoginPage";
import ShelterRegisterPage from "./pages/ShelterRegisterPage";

function RequireShelterAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/shelter/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dogs" replace />} />
        <Route path="/dogSelector" element={<Navigate to="/dogs" replace />} />
        <Route path="/dogs" element={<DogsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shelter/login" element={<ShelterLoginPage />} />
        <Route path="/shelter/register" element={<ShelterRegisterPage />} />
        <Route
          path="/shelter/dashboard"
          element={
            <RequireShelterAuth>
              <ShelterDashboardPage />
            </RequireShelterAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
