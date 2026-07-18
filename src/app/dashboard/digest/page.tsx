"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function DigestPage() {
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeJira, setIncludeJira] = useState(true);
  const [includeGitHub, setIncludeGitHub] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setDigest("");
    try {
      const res = await fetch("/api/digest", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeJira, includeGitHub })
      });
      const data = await res.json();
      setDigest(data.digest || data.error);
    } catch {
      setDigest("Error generating digest.");
    }
    setLoading(false);
  };

  const handlePushToSlack = () => {
    showToast("Digest pushed to #leadership-updates successfully.");
  };

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(digest);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'var(--text-primary)',
          color: 'white',
          padding: '14px 24px',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeSlideUp 0.3s ease-out',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {toast}
        </div>
      )}

      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>Slack / Teams Digest</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Generate and distribute plain-language weekly engineering updates</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Controls Panel */}
        <div className="card">
          <h3 className="card-title">Configuration</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Target Channel</label>
            <select style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '14px' }}>
              <option># leadership-updates (Slack)</option>
              <option># operations-sync (Slack)</option>
              <option>Exec Team (Teams)</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Cadence</label>
            <select style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', fontSize: '14px' }}>
              <option>Every Friday at 4:00 PM</option>
              <option>Daily at 9:00 AM</option>
              <option>Manual Trigger Only</option>
            </select>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Data Sources</div>
            
            <div 
              onClick={() => setIncludeJira(!includeJira)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer', opacity: includeJira ? 1 : 0.5, transition: 'opacity 0.2s' }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `1px solid ${includeJira ? 'var(--accent-primary)' : 'var(--border)'}`, background: includeJira ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {includeJira && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Include Jira Tickets</span>
            </div>

            <div 
              onClick={() => setIncludeGitHub(!includeGitHub)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: includeGitHub ? 1 : 0.5, transition: 'opacity 0.2s' }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `1px solid ${includeGitHub ? 'var(--accent-primary)' : 'var(--border)'}`, background: includeGitHub ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {includeGitHub && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Include GitHub Commits</span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading || (!includeJira && !includeGitHub)}>
            {loading ? "Synthesizing Data..." : "Generate Preview Digest"}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="card-title" style={{ margin: 0 }}>Message Preview</h3>
            {digest && !loading && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                  onClick={handleCopyMarkdown}
                >
                  {copiedMd ? "Copied!" : "Copy Markdown"}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                  onClick={handlePushToSlack}
                >
                  Push to Slack Now
                </button>
              </div>
            )}
          </div>

          <div style={{ 
            background: 'var(--bg)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '24px',
            minHeight: '400px'
          }}>
            {!digest && !loading && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                Click "Generate Preview Digest" to synthesize this week's engineering data.
              </div>
            )}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)', fontWeight: 500 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Reading repositories and tracking boards...
                </div>
                <div style={{ height: '14px', width: '70%', background: 'var(--border)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}></div>
                <div style={{ height: '14px', width: '90%', background: 'var(--border)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.2s' }}></div>
                <div style={{ height: '14px', width: '50%', background: 'var(--border)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out', animationDelay: '0.4s' }}></div>
              </div>
            )}
            {digest && !loading && (
              <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                <ReactMarkdown
                  components={{
                    h3: ({node, ...props}) => <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: 'var(--accent-primary)' }} {...props} />,
                    ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '16px' }} {...props} />,
                    li: ({node, ...props}) => <li style={{ marginBottom: '8px' }} {...props} />,
                    strong: ({node, ...props}) => <strong style={{ fontWeight: 600 }} {...props} />,
                  }}
                >
                  {digest}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
