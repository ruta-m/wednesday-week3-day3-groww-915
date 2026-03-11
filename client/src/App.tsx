import { useState, useEffect } from "react";

// Hooks
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { useLiveMarketWs } from "@/shared/hooks/useLiveMarketWs";

// Components
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardHeader } from "@/shared/components/DashboardHeader";
import { WsStatusBadge } from "@/shared/components/WsStatusBadge";

// Pages
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { LoginPage } from "@/features/auth/LoginPage";

// Updated paths from your old code
import { WatchlistDisplay } from "./features/dashboard/WatchlistPage";
import IndicesPage from "./shared/components/IndicesPage"; 
import NewsPage from "./shared/components/News";

// Stores & Services
import { useUIStore } from "@/store/ui.store";
import { wsManager } from "@/services/websocket";

// ─── Token → clientCode helper ────────────────────────────────────────────────
function getClientCodeFromToken(token: string | null): string {
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (payload.clientCode ?? payload.sub ?? "") as string;
  } catch {
    return localStorage.getItem("client_code") ?? "";
  }
}

// ─── Root component ────────────────────────────────────────────────────────────
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientCode, setClientCode] = useState("");

  const activeTab = useUIStore((s) => s.activeTab);

  useEffect(() => {
    const token = localStorage.getItem("bearer_token");
    if (token) {
      setIsAuthenticated(true);
      setClientCode(getClientCodeFromToken(token));
    }
  }, []);

  // 1. Simulated local WebSocket (Unchanged)
  useWebSocket();

  // 2. Live Market WebSocket (Enabled on Auth)
  useLiveMarketWs({
    clientCode,
    extraSubscriptions: [
      { exchange: "NSE_CM", tokens: ["11377"] }, // HDFCBANK
    ],
  });

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardPage />;
      case "portfolio": return <PortfolioPage />;
      case "orderbook": return <OrderBookPage />;
      case "watchlist": return <WatchlistDisplay />; // Using the display component from old code
      case "indices":   return <IndicesPage />;
      case "news":      return <NewsPage />;
      default:          return <DashboardPage />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          const token = localStorage.getItem("bearer_token");
          setClientCode(getClientCodeFromToken(token));
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "auto",
      background: "var(--bg-void)",
    }}>
      <DashboardHeader />
      <Header />

      <main style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        overflow: "auto", 
        position: "relative" 
      }}>
        {renderTab()}
      </main>

      <footer style={{
        padding: "4px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-panel)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: "9px", color: "var(--text-muted)",
        fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        flexShrink: 0,
      }}>
        {/* Left: simulated server info */}
        <span>ws://localhost:8080 · Simulated data</span>

        {/* Right: Live WebSocket status + Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span>wss://preprodapisix.omnenest.com · Live</span>
          <WsStatusBadge
            showRetry
            onRetry={() => wsManager.connect(clientCode)}
          />
        </div>
      </footer>

      <NotificationStack />
    </div>
  );
}