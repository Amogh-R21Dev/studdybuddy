"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AnimatedBackground from "../../AnimatedBackground";

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: number;
};

type ChannelInfo = {
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
  };
  statistics: {
    subscriberCount: string;
  };
};

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.id as string;

  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [shorts, setShorts] = useState<VideoItem[]>([]);
  const [tab, setTab] = useState<"videos" | "shorts">("videos");
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/youtube/channel?channelId=${channelId}`);
        const data = await res.json();
        setChannel(data.channel);
        setVideos(data.videos || []);
        setShorts(data.shorts || []);
      } catch (err) {
        console.error("Failed to load channel:", err);
      }
      setLoading(false);
    }
    if (channelId) load();
  }, [channelId]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }

  function formatViews(count: string) {
    const n = parseInt(count || "0");
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M views`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K views`;
    return `${n} views`;
  }

  const activeList = tab === "videos" ? videos : shorts;

  return (
    <main style={{ position: "relative", maxWidth: "720px", margin: "0 auto", padding: "40px 24px 60px" }}>
      <AnimatedBackground intensity="calm" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "24px",
            padding: 0,
          }}
        >
          ← Back to Digest
        </button>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading channel...</p>
        ) : (
          <>
            {channel && (
              <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
                {channel.snippet?.thumbnails?.medium?.url && (
                  <img
                    src={channel.snippet.thumbnails.medium.url}
                    alt={channel.snippet.title}
                    style={{ width: "64px", height: "64px", borderRadius: "50%" }}
                  />
                )}
                <div>
                  <h1 style={{ fontSize: "22px", margin: 0 }}>{channel.snippet?.title}</h1>
                  {channel.statistics?.subscriberCount && (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
                      {formatViews(channel.statistics.subscriberCount)} subscribers
                    </p>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setTab("videos")}
                style={{
                  padding: "10px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: tab === "videos" ? "2px solid var(--accent)" : "2px solid transparent",
                  color: tab === "videos" ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Videos ({videos.length})
              </button>
              <button
                onClick={() => setTab("shorts")}
                style={{
                  padding: "10px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: tab === "shorts" ? "2px solid var(--accent)" : "2px solid transparent",
                  color: tab === "shorts" ? "var(--accent)" : "var(--text-muted)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Shorts ({shorts.length})
              </button>
            </div>

            {activeList.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                No {tab} found for this channel recently.
              </p>
            ) : tab === "videos" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {activeList.map((video, i) => (
                  <button
                    key={i}
                    onClick={() => setPlayingId(video.id)}
                    className="fade-up"
                    style={{
                      display: "flex",
                      gap: "14px",
                      textAlign: "left",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "12px",
                      backgroundColor: "var(--bg-elevated)",
                      cursor: "pointer",
                      animationDelay: `${i * 0.03}s`,
                    }}
                  >
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{ width: "160px", height: "90px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <p style={{ color: "var(--text)", fontSize: "14px", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                        {video.title}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: "6px 0 0" }}>
                        {formatViews(video.viewCount)} · {timeAgo(video.publishedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                {activeList.map((short, i) => (
                  <button
                    key={i}
                    onClick={() => setPlayingId(short.id)}
                    className="fade-up"
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "var(--bg-elevated)",
                      cursor: "pointer",
                      padding: 0,
                      animationDelay: `${i * 0.03}s`,
                    }}
                  >
                    {short.thumbnail && (
                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", display: "block" }}
                      />
                    )}
                    <p style={{ color: "var(--text)", fontSize: "12px", margin: 0, padding: "8px", lineHeight: 1.3 }}>
                      {short.title.length > 50 ? short.title.slice(0, 50) + "..." : short.title}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {playingId && (
        <div
          onClick={() => setPlayingId(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: tab === "shorts" ? "360px" : "800px" }}>
            <button
              onClick={() => setPlayingId(null)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text)",
                fontSize: "28px",
                cursor: "pointer",
                marginBottom: "10px",
                float: "right",
              }}
            >
              ×
            </button>
            <div style={{
              position: "relative",
              paddingBottom: tab === "shorts" ? "177.7%" : "56.25%",
              height: 0,
              borderRadius: "12px",
              overflow: "hidden",
              clear: "both",
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
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