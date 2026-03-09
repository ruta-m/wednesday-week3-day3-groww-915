import { useEffect, useState, memo } from "react";
import { getWatchlistScrips } from "@/services/apis/watchlist";

export const WatchlistDisplay = memo(function WatchlistDisplay() {
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWatchlistScrips();
        setWatchlistData(data);
        setErrorStatus(null);
      } catch (err: any) {
        setErrorStatus(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: "var(--green)", padding: "20px", fontSize: "10px" }}>SYNCING WATCHLISTS...</div>;

  // Combine both types of watchlists for display
  const allWatchlists = [
    ...(watchlistData?.userDefinedWatchlists || []),
    ...(watchlistData?.predefinedWatchlists || [])
  ];

  return (
    <div style={{ padding: "20px", background: "var(--bg-void)", minHeight: "100vh" }}>
      <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "20px", letterSpacing: "1px" }}>
        YOUR WATCHLISTS
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {allWatchlists.length > 0 ? (
          allWatchlists.map((wl) => (
            <div 
              key={wl.watchlistId} 
              style={{
                background: "var(--bg-panel)",
                border: wl.watchlistId === watchlistData?.defaultWatchlistId ? "1px solid var(--green)" : "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)" }}>
                   {wl.watchlistName.toUpperCase()}
                </span>
                {wl.watchlistId === watchlistData?.defaultWatchlistId && (
                  <span style={{ fontSize: "8px", color: "var(--green)", border: "1px solid var(--green)", padding: "2px 4px", borderRadius: "4px" }}>
                    DEFAULT
                  </span>
                )}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
                ID: {wl.watchlistId}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "var(--red)", fontSize: "11px" }}>
            {errorStatus ? `ERROR: ${errorStatus}` : "NO WATCHLISTS FOUND"}
          </div>
        )}
      </div>
    </div>
  );
});