"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const SAMPLE_CONFIG = `version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api-server

  api-server:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://db:5432/app
      - REDIS_URL=redis://cache:6379
      - RABBITMQ_URL=amqp://queue:5672
    depends_on:
      - postgres
      - redis
      - rabbitmq

  postgres:
    image: postgres:16
    volumes:
      - pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  rabbitmq:
    image: rabbitmq:3-management

  worker:
    build: ./worker
    depends_on:
      - rabbitmq
      - postgres

  monitoring:
    image: grafana/grafana
    ports:
      - "3000:3000"`;

export default function FlowPage() {
  const [configText, setConfigText] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const diagramRef = useRef<HTMLDivElement>(null);

  const renderMermaid = useCallback(async (code: string) => {
    if (!diagramRef.current || !code) return;
    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#F3E8FF",
          primaryTextColor: "#1A1028",
          primaryBorderColor: "#6D28D9",
          lineColor: "#9990A8",
          secondaryColor: "#FFF9E6",
          tertiaryColor: "#FFFEF5",
          background: "#FFFFFF",
          mainBkg: "#F3E8FF",
          nodeBorder: "#6D28D9",
          clusterBkg: "rgba(109,40,217,0.04)",
          clusterBorder: "rgba(109,40,217,0.15)",
          titleColor: "#1A1028",
          edgeLabelBackground: "#FFFEF5",
        },
        flowchart: { curve: "basis", padding: 20 },
      });

      diagramRef.current.innerHTML = "";
      const { svg } = await mermaid.render("flowchart-svg", code);
      diagramRef.current.innerHTML = svg;
    } catch (err) {
      console.error("Mermaid render error:", err);
      if (diagramRef.current) {
        diagramRef.current.innerHTML = `<p style="color: var(--amber); font-size: 14px;">Diagram rendering issue. The AI-generated syntax may need adjustment.</p><pre style="color: var(--text-muted); font-size: 12px; margin-top: 12px; white-space: pre-wrap;">${code}</pre>`;
      }
    }
  }, []);

  useEffect(() => {
    if (mermaidCode) renderMermaid(mermaidCode);
  }, [mermaidCode, renderMermaid]);

  const handleSynthesize = async () => {
    const text = configText || SAMPLE_CONFIG;
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setMermaidCode("");

    try {
      const res = await fetch("/api/synthesize-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configText: text }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMermaidCode(data.mermaidCode);
      }
    } catch {
      setError("Synthesis service unavailable. Please check your API key.");
    }
    setLoading(false);
  };

  return (
    <>
      <header className="page-header">
        <h2>Visual Flowchart Synthesizer</h2>
        <p>Convert infrastructure configs into executive-friendly business journey maps</p>
      </header>

      <div className="page-body">
        <div className="content-grid">
          <div className="glass-card">
            <div className="glass-card-title">Infrastructure Input</div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", fontWeight: 500 }}>
              Paste a <code style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>docker-compose.yml</code>, Kubernetes manifest, Terraform config, or describe your architecture in plain text.
            </p>
            <textarea
              className="text-area"
              placeholder={SAMPLE_CONFIG}
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              style={{ minHeight: "320px" }}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={handleSynthesize} disabled={loading}>
                {loading ? (<><span className="spinner" /> Synthesizing...</>) : "Generate Business Map"}
              </button>
              <button className="btn btn-secondary" onClick={() => setConfigText(SAMPLE_CONFIG)}>
                Load Sample
              </button>
            </div>
          </div>

          <div className="glass-card">
            <div className="glass-card-title">Business Journey Map</div>
            {error && (
              <div style={{ padding: "16px", background: "var(--red-bg)", borderRadius: "var(--radius-md)", color: "var(--red)", fontSize: "14px", marginBottom: "16px", fontWeight: 500 }}>
                {error}
              </div>
            )}
            <div className="mermaid-container" ref={diagramRef}>
              {!mermaidCode && !loading && !error && (
                <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", fontWeight: 500 }}>
                  Your business journey map will appear here.
                  <br />
                  <span style={{ fontSize: "12px" }}>Paste a config file and click &quot;Generate Business Map&quot;</span>
                </p>
              )}
              {loading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <span className="spinner" style={{ width: "28px", height: "28px" }} />
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>
                    AI is analyzing your architecture...
                  </span>
                </div>
              )}
            </div>

            {mermaidCode && (
              <details style={{ marginTop: "16px" }}>
                <summary style={{ cursor: "pointer", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  View generated Mermaid code
                </summary>
                <pre style={{ marginTop: "8px", padding: "12px", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", fontSize: "11px", color: "var(--text-secondary)", overflow: "auto", whiteSpace: "pre-wrap" }}>
                  {mermaidCode}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
