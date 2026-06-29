"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import AnimatedBackground from "../AnimatedBackground";

export default function Dashboard() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const res = await fetch("/api/youtube");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setFetched(true);
    } catch {
      console.error("Failed to fetch subscriptions");
    }
    setLoading(false);
  }

  return (
    <main style={{ position: "relative", maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
      <AnimatedBackground intensity="calm" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="fade-up">
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Your Digest</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
            Connect your YouTube account to see your personalized feed summary.
          </p>
        </div>

        {!session ? (
          <button
            onClick={() => signIn("google")}
            style={{
              padding: "14px 32px",
              backgroundColor: "var(--accent)",
              color: "#1a1208",
              border: "none",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "24px",
            }}
          >
            Connect YouTube
          </button>
        ) : (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "12px" }}>
              Connected as <strong style={{ color: "var(--text)" }}>{session.user?.email}</strong>
            </p>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <button
                onClick={fetchSubscriptions}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "var(--accent)",
                  color: "#1a1208",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Loading..." : "Load My Subscriptions"}
              </button>

              <button
                onClick={() => signOut()}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "999px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </div>

            {fetched && subscriptions.length === 0 && (
              <p style={{ color: "var(--text-muted)" }}>No subscriptions found.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {subscriptions.map((sub, i) => (
                <div
                  key={i}
                  className="fade-up"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    padding: "16px",
                    backgroundColor: "var(--bg-elevated)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  {sub.snippet?.thumbnails?.default?.url && (
                    <img
                      src={sub.snippet.thumbnails.default.url}
                      alt={sub.snippet.title}
                      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                  )}
                  <div>
                    <strong style={{ fontSize: "14px" }}>{sub.snippet?.title}</strong>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "3px 0 0" }}>
                      {sub.snippet?.description?.slice(0, 80) || "No description"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}