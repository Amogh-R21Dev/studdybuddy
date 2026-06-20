import AnimatedBackground from "./AnimatedBackground";
export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 24px",
        overflow: "hidden",
      }}
    >
    <AnimatedBackground />

      <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            color: "var(--accent)",
            letterSpacing: "0.12em",
            fontSize: "13px",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Open less. Learn more.
        </p>

        <h1 style={{ fontSize: "52px", margin: "0 0 16px", maxWidth: "600px" }}>
          StudyBuddy
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "18px",
            maxWidth: "440px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Your feed, summarized by what actually matters to you — so opening
          an app for one video doesn&apos;t cost you an hour.
        </p>

        <button
          style={{
            padding: "14px 32px",
            fontSize: "16px",
            backgroundColor: "var(--accent)",
            color: "#1a1208",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Connect YouTube
        </button>
      </div>
    </main>
  );
}