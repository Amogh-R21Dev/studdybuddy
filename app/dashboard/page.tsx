import AnimatedBackground from "../AnimatedBackground";

const topics = [
  {
    name: "News",
    note: "Placeholder summary will appear here once your feed is connected.",
  },
  {
    name: "Tech / Hackathons",
    note: "Placeholder summary will appear here once your feed is connected.",
  },
  {
    name: "Entertainment",
    note: "Placeholder summary will appear here once your feed is connected.",
  },
];

export default function Dashboard() {
  return (
    <main style={{ position: "relative", maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
      <AnimatedBackground intensity="calm" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="fade-up">
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Your Digest</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
            Once connected, your summarized feed will appear here — sorted by
            what you actually care about.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {topics.map((t, i) => (
            <div
              key={t.name}
              className="fade-up"
              style={{
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px",
                backgroundColor: "var(--bg-elevated)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <strong style={{ color: "var(--accent)", fontSize: "15px" }}>
                {t.name}
              </strong>
              <p style={{ color: "var(--text-muted)", marginTop: "6px", marginBottom: 0 }}>
                {t.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}