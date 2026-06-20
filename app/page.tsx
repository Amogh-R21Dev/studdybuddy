export default function Home() {
  return (
    <main style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>StudyBuddy</h1>
      <p style={{ color: "#555", marginBottom: "30px" }}>
        Your feed, summarized. No more accidental scrolling.
      </p>
      <button
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Connect YouTube
      </button>
    </main>
  );
}