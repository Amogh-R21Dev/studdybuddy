"use client";

import { useState } from "react";
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

type Video = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [playingVideoTitle, setPlayingVideoTitle] = useState("");

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

  async function fetchVideos(channelId: string) {
    if (selectedChannel === channelId) {
      setSelectedChannel(null);
      setVideos([]);
      return;
    }
    setSelectedChannel(channelId);
    setVideosLoading(true);
    setVideos([]);

    try {
      const res = await fetch(`/api/youtube/videos?channelId=${channelId}`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
    setVideosLoading(false);
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

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
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
                  Click a channel to see and play their recent videos.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {subscriptions.map((sub, i) => {
                    const channelId = sub.snippet?.resourceId?.channelId;
                    const isSelected = selectedChannel === channelId;

                    return (
                      <div key={i}>
                        <div
                          onClick={() => fetchVideos(channelId)}
                          className="fade-up"
                          style={{
                            border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
                            borderRadius: "12px",
                            padding: "14px 16px",
                            backgroundColor: isSelected ? "var(--accent-soft)" : "var(--bg-elevated)",
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            cursor: "pointer",
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
                            <strong style={{ fontSize: "14px", color: isSelected ? "var(--accent)" : "var(--text)" }}>
                              {sub.snippet?.title}
                            </strong>
                          </div>
                          <span style={{ color: "var(--text-muted)", fontSize: "18px" }}>
                            {isSelected ? "▲" : "▼"}
                          </span>
                        </div>

                        {isSelected && (
                          <div style={{ padding: "12px 0 4px 16px" }}>
                            {videosLoading ? (
                              <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "12px 0" }}>
                                Loading videos...
                              </p>
                            ) : videos.length === 0 ? (
                              <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "12px 0" }}>
                                No recent videos found.
                              </p>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {videos.map((video, vi) => (
                                  <button
                                    key={vi}
                                    onClick={() => {
                                      setPlayingVideoId(video.id?.videoId);
                                      setPlayingVideoTitle(video.snippet?.title);
                                    }}
                                    style={{
                                      display: "flex",
                                      gap: "12px",
                                      textAlign: "left",
                                      border: "1px solid var(--border)",
                                      borderRadius: "10px",
                                      padding: "10px",
                                      backgroundColor: "var(--bg)",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {video.snippet?.thumbnails?.medium?.url && (
                                      <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        style={{ width: "120px", height: "68px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
                                      />
                                    )}
                                    <div>
                                      <p style={{ color: "var(--text)", fontSize: "13px", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                                        {video.snippet?.title}
                                      </p>
                                      <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "4px 0 0" }}>
                                        {timeAgo(video.snippet?.publishedAt)}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {playingVideoId && (
        <div
          onClick={() => setPlayingVideoId(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <p style={{ color: "var(--text)", fontSize: "15px", fontWeight: 600, margin: 0 }}>
                {playingVideoTitle}
              </p>
              <button
                onClick={() => setPlayingVideoId(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "24px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
              <iframe
                src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}