import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const subResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20",
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );
    const subData = await subResponse.json();
    const subscriptions = subData.items || [];

    return NextResponse.json({ subscriptions, videos: [] });

  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}