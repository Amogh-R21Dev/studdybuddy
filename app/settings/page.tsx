"use client";

import { useState } from "react";

const categories = ["News", "Tech / Hackathons", "Entertainment", "Science", "Finance", "Health"];

export default function Settings() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["News", "Tech / Hackathons"]);
  const [dailyLimit, setDailyLimit] = useState(30);
  const [saved, setSaved] = useState(false);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Settings</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>
        Customize how StudyBuddy works for you.
      </p>

      <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Digest Categories</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
        Choose what topics appear in your daily digest.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
        {categories.map((cat) => {
          const selected = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                backgroundColor: selected ? "var(--accent-soft)" : "transparent",
                color: selected ? "var(--accent)" : "var(--text-muted)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Daily Time Limit</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
        Get a nudge when you've spent this many minutes on StudyBuddy in a day.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        <input
          type="range"
          min={5}
          max={120}
          step={5}
          value={dailyLimit}
          onChange={(e) => setDailyLimit(Number(e.target.value))}
          style={{ flex: 1, accentColor: "var(--accent)" }}
        />
        <span style={{ color: "var(--accent)", fontFamily: "Georgia, serif", fontSize: "20px", minWidth: "60px" }}>
          {dailyLimit}m
        </span>
      </div>

      <button
        onClick={save}
        style={{
          padding: "13px 32px",
          backgroundColor: "var(--accent)",
          color: "#1a1208",
          border: "none",
          borderRadius: "999px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saved ? "Saved ✓" : "Save Settings"}
      </button>
    </main>
  );
}