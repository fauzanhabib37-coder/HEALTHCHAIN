import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import DashboardBPJS from "./components/DashboardBPJS";
import DashboardFaskes from "./components/DashboardFaskes";
import DashboardPeserta from "./components/DashboardPeserta";
import LoginPage from "./components/LoginPage";
import { Toaster } from "./components/ui/sonner";
import { getAuthToken, clearAuthToken } from "./utils/api";

type Page =
  | "landing"
  | "login"
  | "dashboard-bpjs"
  | "dashboard-faskes"
  | "dashboard-peserta";
type UserRole = "admin-bpjs" | "faskes" | "peserta" | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [_userRole, setUserRole] = useState<UserRole>(null);
  const [_isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && typeof localStorage !== "undefined") {
      const userData = localStorage.getItem("healthchain_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserRole(user.role);
          setIsAuthenticated(true);

          // Navigate to appropriate dashboard
          if (user.role === "admin-bpjs") {
            setCurrentPage("dashboard-bpjs");
          } else if (user.role === "faskes") {
            setCurrentPage("dashboard-faskes");
          } else if (user.role === "peserta") {
            setCurrentPage("dashboard-peserta");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          clearAuthToken();
        }
      }
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);

    // Navigate to appropriate dashboard based on role
    if (role === "admin-bpjs") {
      setCurrentPage("dashboard-bpjs");
    } else if (role === "faskes") {
      setCurrentPage("dashboard-faskes");
    } else if (role === "peserta") {
      setCurrentPage("dashboard-peserta");
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("healthchain_user");
    }
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentPage("landing");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            onBack={() => setCurrentPage("landing")}
          />
        );
      case "dashboard-bpjs":
        return <DashboardBPJS onLogout={handleLogout} />;
      case "dashboard-faskes":
        return <DashboardFaskes onLogout={handleLogout} />;
      case "dashboard-peserta":
        return <DashboardPeserta onLogout={handleLogout} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      <Toaster position="top-right" richColors />
    </div>
  );
}
