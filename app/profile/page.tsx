"use client";

import { useEffect, useState } from "react";

const fakeHistory = [
  { title: "Intro to Neural Networks", channel: "3Blue1Brown", when: "Today" },
  { title: "How OAuth Actually Works", channel: "Fireship", when: "Today" },
  { title: "Hackathon Tips for Beginners", channel: "freeCodeCamp", when: "Yesterday" },
];

const fakeLikes = [
  { title: "Building Your First API", channel: "Web Dev Simplified" },
  { title: "The Bhagavad Gita, Explained Simply", channel: "School of Life" },
];

export default function Profile() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Profile</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
        A quick look at how you&apos;re using StudyBuddy.
      </p>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "24px",
          backgroundColor: "var(--bg-elevated)",
          marginBottom: "28px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "6px" }}>
          TIME SPENT THIS SESSION
        </p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: "var(--accent)", margin: 0 }}>
          {minutes}m {displaySeconds.toString().padStart(2, "0")}s
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "8px" }}>
          This resets when you leave — once accounts are connected, this will
          track daily and weekly totals.
        </p>
      </div>

      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Recently Viewed</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
        {fakeHistory.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ fontSize: "14px" }}>{item.title}</strong>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
              {item.channel} · {item.when}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Liked</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {fakeLikes.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ fontSize: "14px" }}>{item.title}</strong>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
              {item.channel}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}