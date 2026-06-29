import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const messages = [
      {
        role: "system",
        content: `You are StudyBuddy's assistant — a focused, calm, and helpful AI built into a learning app. Keep answers clear and concise.`,
      },
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ reply: `API Error: ${data.error?.message || "Unknown error"}` });
    }

    const reply = data.choices[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { reply: "Something went wrong.", error: String(error) },
      { status: 500 }
    );
  }
}