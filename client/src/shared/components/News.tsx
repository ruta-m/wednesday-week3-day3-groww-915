import { useEffect, useState } from "react";
import { getMarketNews } from "@/services/apis/news";

interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  publishedDate: string;
  source: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchNews = async () => {
    try {
      const response = await getMarketNews();
      console.log("DEBUG: News API raw response:", response);

      // Try every possible location for the array
      const list = Array.isArray(response) ? response : 
                   (Array.isArray(response?.data) ? response.data : 
                   (Array.isArray(response?.news) ? response.news : []));

      console.log("DEBUG: Extracted list:", list);
      setNews(list);
    } catch (err) {
      console.error("Failed to load news", err);
    } finally {
      setLoading(false);
    }
  };
  fetchNews();
}, []);

  if (loading) return <div style={{ color: "var(--green)", padding: "40px", fontFamily: "var(--font-mono)" }}>FETCHING MARKET INTELLIGENCE...</div>;

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", background: "var(--bg-page)", minHeight: "100vh" }}>
      <div style={{ borderLeft: "4px solid var(--green)", paddingLeft: "15px", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "22px", color: "var(--text-primary)", margin: 0 }}>Market News</h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {news.map((item, idx) => (
          <div key={idx} style={{
            background: "var(--bg-panel)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            transition: "border-color 0.2s"
          }}>
            {/* Source and Date Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "10px" }}>
              <span style={{ 
                color: "var(--green)", 
                fontWeight: "bold", 
                textTransform: "uppercase",
                background: "rgba(0, 255, 127, 0.05)",
                padding: "2px 6px",
                borderRadius: "4px"
              }}>
                {item.source.replace('_', ' ')}
              </span>
              <span style={{ color: "var(--text-muted)" }}>{item.publishedDate}</span>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "10px", lineHeight: "1.4" }}>
              {item.title.replace(/&amp;/g, '&')}
            </h2>

            {/* Snippet */}
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "15px" }}>
              {item.contentSnippet}
            </p>

            {/* Link */}
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                fontSize: "11px", 
                color: "var(--green)", 
                textDecoration: "none", 
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              READ FULL ARTICLE ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}