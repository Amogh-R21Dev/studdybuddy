"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import AnimatedBackground from "../AnimatedBackground";

type Subscription = {
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string } };
    resourceId: { channelId: string };
  };
};

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  async function searchChannels() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setSearching(false);
  }

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") searchChannels();
  }

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const res = await fetch("/api/youtube");
      const data = await res.json();
      if (data.error) {
        console.error(data.error);
      } else {
        setSubscriptions(data.subscriptions || []);
        setFetched(true);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
    setLoading(false);
  }

  async function summarizeFeed() {
    if (subscriptions.length === 0) return;
    setSummarizing(true);
    setSummary("");

    const channelList = subscriptions
      .map((s) => s.snippet?.title)
      .filter(Boolean)
      .join(", ");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `I am subscribed to these YouTube channels: ${channelList}. 
Based on these channels, give me a brief digest summary organized by topic (Tech, News, Education, Entertainment etc). 
For each topic, mention which channels likely cover it and what kind of content I can expect. 
Keep it concise and useful.`,
        }),
      });
      const data = await res.json();
      setSummary(data.reply || "");
    } catch (err) {
      console.error("Summarize failed:", err);
    }
    setSummarizing(false);
  }

  return (
    <main style={{ position: "relative", maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>
      <AnimatedBackground intensity="calm" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="fade-up">
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Your Digest</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
            Connect your YouTube account to get a personalized feed summary.
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
            }}
          >
            Connect YouTube
          </button>
        ) : (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              Connected as <strong style={{ color: "var(--text)" }}>{session.user?.email}</strong>
            </p>

            <div style={{ marginBottom: "28px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "10px" }}>
                Find any channel, even ones you don't subscribe to
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKey}
                  placeholder="Search for a channel..."
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    color: "var(--text)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={searchChannels}
                  disabled={searching || !searchQuery.trim()}
                  style={{
                    padding: "11px 20px",
                    backgroundColor: "var(--accent)",
                    color: "#1a1208",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: searching ? "not-allowed" : "pointer",
                  }}
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => router.push(`/channel/${result.snippet?.channelId || result.id?.channelId}`)}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        backgroundColor: "var(--bg-elevated)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {result.snippet?.thumbnails?.default?.url && (
                        <img
                          src={result.snippet.thumbnails.default.url}
                          alt={result.snippet.title}
                          style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0 }}
                        />
                      )}
                      <span style={{ fontSize: "14px", color: "var(--text)" }}>{result.snippet?.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
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

              {fetched && subscriptions.length > 0 && (
                <button
                  onClick={summarizeFeed}
                  disabled={summarizing}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--sage)",
                    color: "var(--text)",
                    border: "none",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: summarizing ? "not-allowed" : "pointer",
                  }}
                >
                  {summarizing ? "Summarizing..." : "Summarize My Feed ✨"}
                </button>
              )}

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

            {summary && (
              <div style={{
                border: "1px solid var(--accent)",
                borderRadius: "14px",
                padding: "24px",
                backgroundColor: "var(--bg-elevated)",
                marginBottom: "28px",
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                fontSize: "15px",
              }}>
                <p style={{ color: "var(--accent)", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                  AI Digest Summary
                </p>
                {summary}
              </div>
            )}

            {subscriptions.length > 0 && (
              <>
                <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
                  Your Subscriptions ({subscriptions.length})
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
                  Click a channel to open their dedicated video & shorts page.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {subscriptions.map((sub, i) => {
                    const channelId = sub.snippet?.resourceId?.channelId;

                    return (
                      <button
                        key={i}
                        onClick={() => router.push(`/channel/${channelId}`)}
                        className="fade-up"
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          padding: "14px 16px",
                          backgroundColor: "var(--bg-elevated)",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          cursor: "pointer",
                          textAlign: "left",
                          animationDelay: `${i * 0.03}s`,
                        }}
                      >
                        {sub.snippet?.thumbnails?.default?.url && (
                          <img
                            src={sub.snippet.thumbnails.default.url}
                            alt={sub.snippet.title}
                            style={{ width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <strong style={{ fontSize: "14px", color: "var(--text)" }}>
                            {sub.snippet?.title}
                          </strong>
                        </div>
                        <span style={{ color: "var(--text-muted)", fontSize: "16px" }}>→</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}