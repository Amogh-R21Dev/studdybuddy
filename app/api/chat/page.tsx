import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  return NextResponse.json({
    reply: `(Claude not connected yet) You asked: "${message}" — once the API key is added, a real answer will appear here.`,
  });
}