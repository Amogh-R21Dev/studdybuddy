"use client";097865ewa

import { useEffect, useState } from "react";

export default function Timer() {
  const [inputMinutes, setInputMinutes] = useState(20);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || secondsLeft === null) return;

    if (secondsLeft === 0) {
      setRunning(false);
      setDone(true);
      return;
    }

    const tick = setTimeout(() => {
      setSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);

    return () => clearTimeout(tick);
  }, [running, secondsLeft]);

  function start() {
    setSecondsLeft(inputMinutes * 60);
    setRunning(true);
    setDone(false);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(null);
    setDone(false);
  }

  const minutes = secondsLeft !== null ? Math.floor(secondsLeft / 60) : inputMinutes;
  const seconds = secondsLeft !== null ? secondsLeft % 60 : 0;

  return (
    <main style={{ maxWidth: "480px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>Focus Timer</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "48px" }}>
        Set a limit before you start. Step away when it rings.
      </p>

      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "72px",
          color: done ? "#e85d3d" : "var(--accent)",
          marginBottom: "32px",
          letterSpacing: "-2px",
        }}
      >
        {done
          ? "Done"
          : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
      </div>

      {done && (
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          Time&apos;s up — step away, you&apos;ve earned it.
        </p>
      )}

      {!running && !done && (
        <div style={{ marginBottom: "32px" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "13px", display: "block", marginBottom: "10px" }}>
            SET MINUTES
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={inputMinutes}
            onChange={(e) => setInputMinutes(Number(e.target.value))}
            style={{
              width: "100px",
              padding: "10px",
              fontSize: "18px",
              textAlign: "center",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text)",
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        {!running && !done && (
          <button
            onClick={start}
            style={{
              padding: "12px 32px",
              backgroundColor: "var(--accent)",
              color: "#1a1208",
              border: "none",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start
          </button>
        )}

        {(running || done) && (
          <button
            onClick={reset}
            style={{
              padding: "12px 32px",
              backgroundColor: "transparent",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </main>
  );
}ojkmh 