"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Digest" },
  { href: "/quotes", label: "Quotes" },
  { href: "/chat", label: "Assistant" },
  { href: "/timer", label: "Timer" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "200px",
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        padding: "28px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 10,
        backgroundColor: "rgba(15, 20, 25, 0.85)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ fontFamily: "Georgia, serif", fontSize: "19px", marginBottom: "32px", paddingLeft: "10px" }}>
        StudyBuddy
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                textDecoration: "none",
                color: active ? "var(--accent)" : "var(--text-muted)",
                backgroundColor: active ? "var(--accent-soft)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}