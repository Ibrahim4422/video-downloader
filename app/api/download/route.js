import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    if (ytdl.validateURL(url)) {
      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, { quality: "highest" });

      // Set headers for streaming
      const headers = new Headers();
      headers.set(
        "Content-Disposition",
        `attachment; filename="${info.videoDetails.title}.mp4"`
      );
      headers.set("Content-Type", "video/mp4");

      // Create a readable stream
      const stream = ytdl(url, { format });

      // Convert stream to Response
      return new NextResponse(stream, {
        headers,
        status: 200,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    return NextResponse.json(
      { error: "Failed to download video" },
      { status: 500 }
    );
  }
}
