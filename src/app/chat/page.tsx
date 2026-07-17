"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "Why is the database migration taking an extra week?",
  "What features shipped this sprint?",
  "Is the mobile app launch still on track?",
  "What does the payment gateway upgrade mean for our customers?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I am your project Q&A assistant. Ask me anything about what the engineering team is working on and I will explain it in plain language. No technical jargon, I promise.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || data.error || "Something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Please check your API key and try again." },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="page-header">
        <h2>Q&A Sandbox</h2>
        <p>Ask anything about the project and get clear, jargon-free answers</p>
      </header>

      <div className="page-body">
        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "24px 24px 0" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "8px 14px" }}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 24px 24px" }}>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role}`}>
                    <div className="bubble-label">
                      {msg.role === "user" ? "You" : "DevTranslate AI"}
                    </div>
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="chat-bubble assistant">
                    <div className="bubble-label">DevTranslate AI</div>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="spinner" /> Thinking...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-bar">
                <input
                  type="text"
                  placeholder="Ask about the project status, delays, features..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loading}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
