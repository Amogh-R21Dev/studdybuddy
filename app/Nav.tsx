import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "20px",
          color: "var(--text)",
          textDecoration: "none",
        }}
      >
        StudyBuddy
      </Link>

      <div style={{ display: "flex", gap: "28px" }}>
        <Link href="/dashboard" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "14px" }}>
          Digest
        </Link>
        <Link href="/quotes" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "14px" }}>
          Quotes
        </Link>
      </div>
    </nav>
  );
}