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
      } catch (err: any) {
        setErrorStatus(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ color: "var(--green)", padding: "20px" }}>SYNCING...</div>;

  // --- ROBUST EXTRACTION ---
  // We check multiple common keys to ensure we get the arrays
  const userWL = watchlistData?.userDefinedWatchlists || watchlistData?.userWatchlists || [];
  const preWL  = watchlistData?.predefinedWatchlists || watchlistData?.systemWatchlists || [];
  const defaultId = watchlistData?.defaultWatchlistId || watchlistData?.defaultId;

  const allWatchlists = [...userWL, ...preWL];

  return (
    <div style={{ padding: "20px", background: "var(--bg-void)", minHeight: "100vh" }}>
      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
        YOUR WATCHLISTS ({allWatchlists.length})
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {allWatchlists.length > 0 ? (
          allWatchlists.map((wl: any) => (
            <div 
              key={wl.watchlistId || wl.id} 
              style={{
                background: "var(--bg-panel)",
                border: (wl.watchlistId === defaultId) ? "1px solid var(--green)" : "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-primary)" }}>
                   {/* Fallback for name */}
                   {(wl.watchlistName || wl.name || "Unnamed").toUpperCase()}
                </span>
                {(wl.watchlistId === defaultId) && (
                  <span style={{ fontSize: "8px", color: "var(--green)", border: "1px solid var(--green)", padding: "2px 4px" }}>
                    DEFAULT
                  </span>
                )}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
                ID: {wl.watchlistId || wl.id}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "var(--red)", fontSize: "11px" }}>
            {errorStatus ? `ERROR: ${errorStatus}` : "NO DATA FOUND IN API RESPONSE"}
          </div>
        )}
      </div>
    </div>
  );
});