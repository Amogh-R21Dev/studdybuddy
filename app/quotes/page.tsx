import AnimatedBackground from "../AnimatedBackground";

const quotes = [
  {
    text: "You have the right to work, but never to the fruit of work.",
    source: "Bhagavad Gita, Ch. 2",
  },
  {
    text: "The mind is restless, but it can be trained through steady practice.",
    source: "Bhagavad Gita, Ch. 6",
  },
  {
    text: "A disciplined mind brings happiness.",
    source: "Bhagavad Gita, Ch. 6",
  },
  {
    text: "Small disciplines repeated with consistency lead to great achievements gathered over time.",
    source: "John C. Maxwell",
  },
  {
    text: "Until you value yourself, you won't value your time.",
    source: "M. Scott Peck",
  },
];

export default function Quotes() {
  return (
    <main style={{ position: "relative", maxWidth: "600px", margin: "0 auto", padding: "60px 24px" }}>
      <AnimatedBackground intensity="calm" />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="fade-up">
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Stay Grounded</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
            A few words to return to, when the scroll starts pulling.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {quotes.map((q, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                borderLeft: "3px solid var(--accent)",
                paddingLeft: "18px",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", margin: 0, lineHeight: 1.5 }}>
                &ldquo;{q.text}&rdquo;
              </p>
              <p style={{ color: "var(--sage)", fontSize: "13px", marginTop: "8px" }}>
                {q.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}