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
  const [copied, setCopied] = useState(false);
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>Translation Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Convert technical commits and PRs into business-friendly language</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        {/* Input Panel */}
        <div className="card">
          <h3 className="card-title">Technical Input</h3>
          <div style={{ position: 'relative' }}>
            <textarea
              style={{
                width: "100%",
                minHeight: "140px",
                marginBottom: "8px",
                padding: "16px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-primary)",
                resize: "vertical",
                outline: "none",
              }}
              placeholder="Paste any technical commit message, PR description, or Jira comment here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginBottom: '16px' }}>
              {input.length} characters
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "32px" }}>
            <button className="btn btn-primary" onClick={handleTranslate} disabled={loading || !input.trim()}>
              {loading ? "Translating..." : "Translate to Business Value"}
            </button>
            <button className="btn btn-secondary" onClick={() => { setInput(""); setResult(""); }} disabled={!input && !result}>
              Clear
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div style={{
              padding: "20px",
              background: "var(--bg)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}>
              <div style={{ height: '12px', width: '40%', background: 'var(--border)', borderRadius: '4px', marginBottom: '16px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
              <div style={{ height: '14px', width: '100%', background: 'var(--border)', borderRadius: '4px', marginBottom: '10px', animation: 'skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.2s' }}></div>
              <div style={{ height: '14px', width: '85%', background: 'var(--border)', borderRadius: '4px', marginBottom: '10px', animation: 'skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.4s' }}></div>
              <div style={{ height: '14px', width: '60%', background: 'var(--border)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.6s' }}></div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div style={{
              padding: "20px",
              background: "var(--accent-soft)",
              borderRadius: "var(--radius-md)",
              borderLeft: "4px solid var(--accent-primary)",
              fontSize: "15px",
              lineHeight: 1.6,
              fontWeight: 500,
              color: "var(--accent-primary)",
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Business Translation
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? 'var(--accent-primary)' : 'none',
                    border: copied ? 'none' : '1px solid var(--accent-primary)',
                    color: copied ? 'white' : 'var(--accent-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              {result}
            </div>
          )}

          <div style={{ marginTop: "32px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              Try these examples
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {EXAMPLE_INPUTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex)}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "10px 16px", textAlign: "left", justifyContent: "flex-start", fontFamily: "var(--font-mono)", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="card">
          <h3 className="card-title">Translation History</h3>
          {history.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", fontWeight: 500 }}>
              Your translations will appear here.
              <br />
              <span style={{ fontSize: "12px", fontWeight: 400 }}>Start by entering a technical update on the left.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {history.map((item, i) => (
                <div key={i} style={{ paddingBottom: '20px', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {item.tech}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.business}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
