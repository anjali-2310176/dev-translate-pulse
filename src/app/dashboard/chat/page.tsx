"use client";

import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "Why is the database migration taking an extra week?",
  "What was shipped this sprint?",
  "Is the payment upgrade on track?",
  "What is blocking the mobile app launch?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Hi Sarah. I am connected to the AeroFlow engineering Jira and GitHub repositories. What business impact or technical blockers can I explain for you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.sessions && data.sessions.length > 0) {
            const latestSession = data.sessions[0];
            setSessionId(latestSession.id);
            try {
              const parsedHistory = JSON.parse(latestSession.history);
              setMessages(parsedHistory.map((item: any) => ({
                role: item.role === "user" ? "user" : "bot",
                content: item.text
              })));
            } catch (e) {
              console.error("Failed to parse history");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat sessions");
      }
    };
    loadSessions();
  }, []);

  const handleSend = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Build conversation history for multi-turn context
    const history = messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      text: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history, sessionId }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "bot", content: data.reply || data.error }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Connection error. Please check your Gemini API key configuration." },
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
        <button
          className="btn btn-secondary"
          onClick={() => {
            setMessages([{ role: "bot", content: "Session cleared. How can I help you understand the engineering work?" }]);
            setSessionId(null);
          }}
          style={{ fontSize: '13px' }}
        >
          Clear Chat
        </button>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', padding: 0, overflow: 'hidden' }}>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'bot' && (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', flexShrink: 0, marginTop: '2px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
              )}
              <div style={{
                maxWidth: '70%',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                fontSize: '14px',
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(232, 122, 93, 0.2)' : 'none',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-dot 1.4s infinite ease-in-out', animationDelay: '0s' }}></span>
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-dot 1.4s infinite ease-in-out', animationDelay: '0.2s' }}></span>
                <span className="typing-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse-dot 1.4s infinite ease-in-out', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div style={{ padding: '0 32px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
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
            <button className="btn btn-primary" style={{ borderRadius: 'var(--radius-pill)', padding: '0 24px' }} onClick={() => handleSend()} disabled={loading || !input.trim()}>
              Ask Pulse
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
