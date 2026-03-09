import { useEffect, useState } from "react";
import { getIndicesConfig } from "@/services/apis/indices";

interface IndexData {
  indexName: string;
  exchange: string;
  symbolName: string;
  exchangeSegment: string;
  indexToken: string;
}

export default function IndicesPage() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const data = await getIndicesConfig();
        const list = data?.indices || data?.data?.indices || [];
        setIndices(list);
      } catch (err) {
        console.error("Failed to load indices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIndices();
  }, []);

  if (loading)
    return (
      <div style={{ color: "var(--text-muted)", padding: "40px" }}>
        LOADING INDICES...
      </div>
    );

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--bg-page)",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "18px",
          marginBottom: "24px",
          color: "var(--text-primary)",
        }}
      >
        Market Indices
      </h1>

      {/* Grid Container for the two cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          maxWidth: "800px",
        }}
      >
        {indices.map((item, index) => (
          <div
            key={index}
            style={{
              background: "var(--bg-panel)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.indexName}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {item.symbolName}
                </div>
              </div>
              <span
                style={{
                  background: "rgba(0, 200, 83, 0.1)",
                  color: "var(--green)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                {item.exchange}
              </span>
            </div>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border)",
                margin: "8px 0",
              }}
            />

            {/* Details Section */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  SEGMENT
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-primary)",
                    fontWeight: "bold",
                  }}
                >
                  {item.exchangeSegment.toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  TOKEN
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-primary)",
                  }}
                >
                  {item.indexToken}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}