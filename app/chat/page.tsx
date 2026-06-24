"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm your StudyBuddy assistant. Ask me anything — about what you're learning, your digest, or any topic you're curious about.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>
      <div style={{ padding: "28px 0 16px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: "22px", margin: 0 }}>Assistant</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
          Ask anything — powered by Claude once connected
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                backgroundColor: msg.role === "user" ? "var(--accent)" : "var(--bg-elevated)",
                color: msg.role === "user" ? "#1a1208" : "var(--text)",
                fontSize: "15px",
                lineHeight: 1.5,
                border: msg.role === "assistant" ? "1px solid var(--border)" : "none",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "15px" }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "16px 0 24px", borderTop: "1px solid var(--border)", display: "flex", gap: "10px" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask something..."
          rows={1}
          style={{
            flex: 1,
            padding: "12px 16px",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "var(--text)",
            fontSize: "15px",
            resize: "none",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            padding: "12px 20px",
            backgroundColor: input.trim() ? "var(--accent)" : "var(--border)",
            color: input.trim() ? "#1a1208" : "var(--text-muted)",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: input.trim() ? "pointer" : "not-allowed",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}