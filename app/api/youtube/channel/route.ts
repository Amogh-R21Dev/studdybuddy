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

async function fetchVideoBatch(channelId: string, headers: any, pageToken?: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("order", "date");
  url.searchParams.set("type", "video");
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const res = await fetch(url.toString(), { headers });
  return res.json();
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

    let allItems: any[] = [];
    let pageToken: string | undefined = undefined;
    for (let i = 0; i < 3; i++) {
      const batch = await fetchVideoBatch(channelId, headers, pageToken);
      allItems = allItems.concat(batch.items || []);
      pageToken = batch.nextPageToken;
      if (!pageToken) break;
    }

    const videoIds = allItems.map((v: any) => v.id?.videoId).filter(Boolean);

    if (videoIds.length === 0) {
      return NextResponse.json({ channel: channelInfo, videos: [], shorts: [] });
    }

    const videos: any[] = [];
    const shorts: any[] = [];

    for (let i = 0; i < videoIds.length; i += 50) {
      const idBatch = videoIds.slice(i, i + 50).join(",");
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${idBatch}`,
        { headers }
      );
      const detailsData = await detailsRes.json();
      const details = detailsData.items || [];

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
    }

    return NextResponse.json({ channel: channelInfo, videos, shorts });

  } catch (error) {
    console.error("YouTube channel error:", error);
    return NextResponse.json({ error: "Failed to fetch channel data" }, { status: 500 });
  }
}