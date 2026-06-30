import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return NextResponse.json({ error: "No channelId provided" }, { status: 400 });
    }

    const headers = { Authorization: `Bearer ${session.accessToken}` };

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}`,
      { headers }
    );
    const channelData = await channelRes.json();
    const channelInfo = channelData.items?.[0] || null;

    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=25&order=date&type=video`,
      { headers }
    );
    const searchData = await searchRes.json();
    const items = searchData.items || [];

    const videoIds = items.map((v: any) => v.id?.videoId).filter(Boolean).join(",");

    if (!videoIds) {
      return NextResponse.json({ channel: channelInfo, videos: [], shorts: [] });
    }

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${videoIds}`,
      { headers }
    );
    const detailsData = await detailsRes.json();
    const details = detailsData.items || [];

    const videos: any[] = [];
    const shorts: any[] = [];

    for (const video of details) {
      const seconds = parseDuration(video.contentDetails?.duration || "");
      const item = {
        id: video.id,
        title: video.snippet?.title,
        thumbnail: video.snippet?.thumbnails?.medium?.url,
        publishedAt: video.snippet?.publishedAt,
        viewCount: video.statistics?.viewCount,
        duration: seconds,
      };
      if (seconds > 0 && seconds <= 60) {
        shorts.push(item);
      } else {
        videos.push(item);
      }
    }

    return NextResponse.json({ channel: channelInfo, videos, shorts });

  } catch (error) {
    console.error("YouTube channel error:", error);
    return NextResponse.json({ error: "Failed to fetch channel data" }, { status: 500 });
  }
}