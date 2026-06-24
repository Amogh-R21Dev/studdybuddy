"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (!email || !password) {
      setMessage("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Account created! Check your email to confirm, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        router.push("/onboarding");
      }
    }
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <main style={{ maxWidth: "400px", margin: "0 auto", padding: "80px 24px" }}>
      <div className="fade-up">
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "36px" }}>
          {mode === "login"
            ? "Log in to see your digest."
            : "Sign up to get started with StudyBuddy."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text)",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {message && (
          <p style={{ color: "var(--accent)", fontSize: "14px", marginBottom: "16px" }}>
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            backgroundColor: "var(--accent)",
            color: "#1a1208",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
          }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontSize: "14px",
              padding: 0,
            }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </main>
  );
}