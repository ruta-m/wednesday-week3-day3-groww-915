import { useState, useEffect } from "react";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";

// 1. Updated path for Watchlist
import { WatchlistDisplay } from "./features/dashboard/WatchlistPage";

import { LoginPage } from "@/features/auth/LoginPage";
import { useUIStore } from "@/store/ui.store";
import { DashboardHeader } from "@/shared/components/DashboardHeader";

// 2. Ensure this component exports default or adjust the curly braces
import IndicesPage from "./shared/components/IndicesPage"; 
import NewsPage from "./shared/components/News";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bearer_token');
    if (token) setIsAuthenticated(true);
  }, []);

  // Only connect to WS if logged in
  useWebSocket();

  const activeTab = useUIStore((s) => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":  return <DashboardPage />;
      case "portfolio":  return <PortfolioPage />;
      case "orderbook":  return <OrderBookPage />;
      case "watchlist":  return <WatchlistDisplay />;
      case "indices":    return <IndicesPage />; // Now handles the "indices" state
      case "news" : return <NewsPage />
      default:           return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--bg-void)",
    }}>
      {/* This top bar stays visible across all tabs */}
      <DashboardHeader /> 
      
      {/* Ensure your Header component has a button that calls setActiveTab("indices") */}
      <Header />

      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", // Ensures child pages fill correctly
        overflow: "auto",        // Allows pages like IndicesPage to scroll if needed
        position: "relative" 
      }}>
        {renderTab()}
      </main>

      <footer style={{
        padding: "4px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-panel)",
        display: "flex", justifyContent: "space-between",
        fontSize: "9px", color: "var(--text-muted)",
        fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        flexShrink: 0,
      }}>
        <span>ws://localhost:8080</span>
        <span>Groww-915 · Simulated data — for learning only</span>
      </footer>

      <NotificationStack />
    </div>
  );
}