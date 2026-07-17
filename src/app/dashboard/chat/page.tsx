"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Hi Sarah. I'm connected to the AeroFlow engineering Jira and GitHub repositories. What business impact or technical blockers can I explain for you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply || data.error }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Connection error. Please check your Gemini API key." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="dash-header-row">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em' }}>Sandbox Q&A</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Ask business questions about the underlying engineering work</p>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', padding: 0, overflow: 'hidden' }}>
        
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                fontSize: '14px',
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(15, 82, 186, 0.2)' : 'none',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '14px', color: 'var(--text-muted)' }}>
                Analyzing repository data...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about technical blockers, sprint delays, or feature capabilities..."
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '0 24px' }} onClick={handleSend} disabled={loading || !input.trim()}>
              Ask Pulse
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
