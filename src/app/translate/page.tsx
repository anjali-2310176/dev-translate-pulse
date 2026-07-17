"use client";

import { useState } from "react";

const EXAMPLE_INPUTS = [
  "Merged PR #512: Migrated user sessions from cookie-based auth to stateless JWT with Redis-backed refresh tokens",
  "Refactored the Redis caching layer to use read-through strategy with TTL-based invalidation",
  "Deployed Kubernetes HPA for the order-service with CPU-based autoscaling thresholds",
  "Fixed N+1 query issue in the product catalog GraphQL resolver by implementing DataLoader batching",
];

export default function TranslatePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ tech: string; business: string }[]>([]);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicalText: input }),
      });
      const data = await res.json();
      const translation = data.translation || data.error;
      setResult(translation);
      if (data.translation) {
        setHistory((prev) => [{ tech: input, business: data.translation }, ...prev].slice(0, 10));
      }
    } catch {
      setResult("Translation service unavailable. Please check your API key.");
    }
    setLoading(false);
  };

  return (
    <>
      <header className="page-header">
        <h2>Translation Engine</h2>
        <p>Convert technical commits, PRs, and Jira comments into business-friendly language</p>
      </header>

      <div className="page-body">
        <div className="content-grid">
          {/* Input Panel */}
          <div className="glass-card">
            <div className="glass-card-title">Technical Input</div>
            <textarea
              className="text-area"
              placeholder="Paste any technical commit message, PR description, or Jira comment here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: "140px", marginBottom: "12px" }}
            />

            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
              <button className="btn btn-primary" onClick={handleTranslate} disabled={loading || !input.trim()}>
                {loading ? (<><span className="spinner" /> Translating...</>) : "Translate to Business Value"}
              </button>
              <button className="btn btn-secondary" onClick={() => setInput("")} disabled={!input}>
                Clear
              </button>
            </div>

            {result && (
              <div style={{
                padding: "16px",
                background: "var(--green-bg)",
                borderRadius: "var(--radius-md)",
                borderLeft: "3px solid var(--green)",
                fontSize: "14px",
                lineHeight: 1.7,
                fontWeight: 500,
                animation: "fadeSlideIn 0.4s ease-out",
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
                  Business Translation
                </div>
                {result}
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                Try these examples
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {EXAMPLE_INPUTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(ex)}
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "8px 12px", textAlign: "left", justifyContent: "flex-start", fontFamily: "var(--font-mono)" }}
                  >
                    {ex.slice(0, 80)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="glass-card">
            <div className="glass-card-title">Translation History</div>
            {history.length === 0 ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", fontWeight: 500 }}>
                Your translations will appear here.
                <br />
                <span style={{ fontSize: "12px" }}>Start by entering a technical update on the left.</span>
              </div>
            ) : (
              history.map((item, i) => (
                <div className="translation-item" key={i} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="tech-text">{item.tech}</div>
                  <div className="business-text">{item.business}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
