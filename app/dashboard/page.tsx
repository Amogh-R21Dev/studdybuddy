const topics = [
  { name: "News", note: "Placeholder summary will appear here." },
  { name: "Tech / Hackathons", note: "Placeholder summary will appear here." },
  { name: "Entertainment", note: "Placeholder summary will appear here." },
];

export default function Dashboard() {
  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Your Digest</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
        Once connected, your summarized feed will appear here.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {topics.map((t) => (
          <div
            key={t.name}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "20px",
              backgroundColor: "var(--bg-elevated)",
            }}
          >
            <strong style={{ color: "var(--accent)", fontSize: "15px" }}>{t.name}</strong>
            <p style={{ color: "var(--text-muted)", marginTop: "6px", marginBottom: 0 }}>
              {t.note}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}