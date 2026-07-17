"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SAMPLE_ACTIVITY = `Sprint 14 highlights:
- Merged 23 PRs this week
- Fixed race condition in Redis cache hydration (PR #402)
- Completed JWT token rotation implementation with refresh flow
- Migrated 3 microservices to pgBouncer connection pooling
- Started Stripe v3 payment gateway integration (60% done)
- Mobile app: push notification service refactored for FCM v2
- Database migration to PostgreSQL 16 completed successfully
- CI/CD pipeline migrated from Jenkins to GitHub Actions
- Added real-time inventory tracking websocket endpoints

Blockers:
- Stripe sandbox environment down for maintenance (est. 2 days)
- Push notification vendor changed their API spec unexpectedly

Team velocity: 45 story points (up from 38 last sprint)
Sprint goal completion: 78%
Active engineers: 6 + 1 DevOps`;

export default function DigestPage() {
  const [projectData, setProjectData] = useState("");
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setDigest("");

    try {
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectData: projectData || undefined }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setDigest(data.digest);
      }
    } catch {
      setError("Digest service unavailable. Please check your API key.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="page-header">
        <h2>Digest Generator</h2>
        <p>Generate Slack and Teams ready weekly status briefs in plain language</p>
      </header>

      <div className="page-body">
        <div className="content-grid">
          <div className="glass-card">
            <div className="glass-card-title">Engineering Activity Input</div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", fontWeight: 500 }}>
              Paste your sprint data, commit logs, Jira export, or leave blank for a demo digest.
            </p>
            <textarea
              className="text-area"
              placeholder={SAMPLE_ACTIVITY}
              value={projectData}
              onChange={(e) => setProjectData(e.target.value)}
              style={{ minHeight: "300px" }}
            />
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
                {loading ? (<><span className="spinner" /> Generating...</>) : "Generate Weekly Digest"}
              </button>
              <button className="btn btn-secondary" onClick={() => setProjectData(SAMPLE_ACTIVITY)}>
                Load Sample Data
              </button>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div className="glass-card-title" style={{ marginBottom: 0 }}>
                Digest Preview
              </div>
              {digest && (
                <button className="btn btn-secondary" style={{ fontSize: "12px", padding: "6px 14px" }} onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              )}
            </div>

            {error && (
              <div style={{ padding: "16px", background: "var(--red-bg)", borderRadius: "var(--radius-md)", color: "var(--red)", fontSize: "14px", fontWeight: 500 }}>
                {error}
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "12px" }}>
                <span className="spinner" style={{ width: "28px", height: "28px" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>AI is drafting your digest...</span>
              </div>
            )}

            {digest && (
              <div className="digest-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{digest}</ReactMarkdown>
              </div>
            )}

            {!digest && !loading && !error && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", color: "var(--text-muted)", fontSize: "14px", textAlign: "center", fontWeight: 500 }}>
                Your generated digest will appear here.
                <br />
                <span style={{ fontSize: "12px" }}>Ready to copy and paste into Slack or Teams.</span>
              </div>
            )}

            {digest && (
              <div style={{ marginTop: "16px", padding: "12px 16px", background: "var(--accent-bg)", borderRadius: "var(--radius-md)", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                Tip: Copy this digest and paste it directly into your #project-updates Slack channel or Teams group.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
