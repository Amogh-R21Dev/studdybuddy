import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "No search query provided" }, { status: 400 });
    }

    const headers = { Authorization: `Bearer ${session.accessToken}` };

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=8`,
      { headers }
    );
    const data = await res.json();

    return NextResponse.json({ results: data.items || [] });

  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}