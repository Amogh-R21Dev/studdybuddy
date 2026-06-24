"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const careers = [
  "Software Engineering",
  "AI / Machine Learning",
  "Design & UX",
  "Business & Entrepreneurship",
  "Science & Research",
  "Politics & Current Affairs",
  "Finance & Economics",
  "Health & Wellness",
];

const suggestedChannels: Record<string, { name: string; description: string }[]> = {
  "Software Engineering": [
    { name: "Fireship", description: "Fast, modern web dev concepts" },
    { name: "Traversy Media", description: "Practical project-based tutorials" },
    { name: "The Primeagen", description: "Performance and real engineering talk" },
  ],
  "AI / Machine Learning": [
    { name: "3Blue1Brown", description: "Math and neural networks, visualized beautifully" },
    { name: "Andrej Karpathy", description: "Deep learning from an OpenAI founder" },
    { name: "Yannic Kilcher", description: "Research paper breakdowns" },
  ],
  "Design & UX": [
    { name: "Figma", description: "Official Figma tutorials and design thinking" },
    { name: "AJ&Smart", description: "Design sprints and product thinking" },
    { name: "Jesse Showalter", description: "UI/UX career and workflow" },
  ],
  "Business & Entrepreneurship": [
    { name: "Y Combinator", description: "Startup advice from the best accelerator" },
    { name: "My First Million", description: "Business ideas and founder stories" },
    { name: "Alex Hormozi", description: "Offer building and scaling businesses" },
  ],
  "Science & Research": [
    { name: "Veritasium", description: "Physics and science made fascinating" },
    { name: "Kurzgesagt", description: "Big ideas explained with stunning animation" },
    { name: "SciShow", description: "Daily science news and discoveries" },
  ],
  "Politics & Current Affairs": [
    { name: "Vox", description: "Context-first news explainers" },
    { name: "TLDR News", description: "Quick global news breakdowns" },
    { name: "PolyMatter", description: "Geopolitics and world systems" },
  ],
  "Finance & Economics": [
    { name: "Plain Bagel", description: "Investing explained without hype" },
    { name: "Patrick Boyle", description: "Finance and hedge fund perspective" },
    { name: "Economics Explained", description: "How economies actually work" },
  ],
  "Health & Wellness": [
    { name: "Andrew Huberman", description: "Science-backed health and performance" },
    { name: "Thomas DeLauer", description: "Nutrition and metabolic health" },
    { name: "Yoga With Adriene", description: "Accessible yoga for everyone" },
  ],
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const router = useRouter();

  function toggleChannel(name: string) {
    setSelectedChannels((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  function finish() {
    router.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 24px" }}>
      {step === 1 && (
        <div className="fade-up">
          <p style={{ color: "var(--accent)", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Step 1 of 2
          </p>
          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>What are you focused on?</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
            Pick the area that matters most to you right now. This shapes your digest.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {careers.map((career) => (
              <button
                key={career}
                onClick={() => setSelectedCareer(career)}
                style={{
                  padding: "14px 18px",
                  textAlign: "left",
                  backgroundColor: selectedCareer === career ? "var(--accent-soft)" : "var(--bg-elevated)",
                  border: `1px solid ${selectedCareer === career ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "10px",
                  color: selectedCareer === career ? "var(--accent)" : "var(--text)",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {career}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedCareer}
            style={{
              marginTop: "28px",
              padding: "13px 32px",
              backgroundColor: selectedCareer ? "var(--accent)" : "var(--border)",
              color: selectedCareer ? "#1a1208" : "var(--text-muted)",
              border: "none",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: selectedCareer ? "pointer" : "not-allowed",
            }}
          >
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-up">
          <p style={{ color: "var(--accent)", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Step 2 of 2
          </p>
          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Suggested channels for you</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
            Based on <strong style={{ color: "var(--text)" }}>{selectedCareer}</strong>. Select the ones you want in your digest.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {suggestedChannels[selectedCareer]?.map((ch) => {
              const selected = selectedChannels.includes(ch.name);
              return (
                <button
                  key={ch.name}
                  onClick={() => toggleChannel(ch.name)}
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elevated)",
                    border: `1px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ color: selected ? "var(--accent)" : "var(--text)", fontSize: "15px" }}>
                    {ch.name}
                  </strong>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "3px 0 0" }}>
                    {ch.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: "13px 24px",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              ← Back
            </button>
            <button
              onClick={finish}
              disabled={selectedChannels.length === 0}
              style={{
                padding: "13px 32px",
                backgroundColor: selectedChannels.length > 0 ? "var(--accent)" : "var(--border)",
                color: selectedChannels.length > 0 ? "#1a1208" : "var(--text-muted)",
                border: "none",
                borderRadius: "999px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: selectedChannels.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              Go to my Digest →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}