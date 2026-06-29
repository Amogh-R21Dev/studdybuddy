import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=10",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json({ subscriptions: data.items || [] });

  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}