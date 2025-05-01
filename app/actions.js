"use server";

import ytdl from "ytdl-core";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function downloadVideo(url) {
  try {
    // Validate URL
    if (!url) {
      return { error: "Please provide a video URL" };
    }

    // For YouTube videos
    if (ytdl.validateURL(url)) {
      try {
        // Get video info
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title;
        const videoId = info.videoDetails.videoId;

        // Get the highest quality format that includes both video and audio
        const format = ytdl.chooseFormat(info.formats, { quality: "highest" });

        // Generate a unique filename
        const fileName = `${videoId}-${uuidv4()}.mp4`;
        const filePath = join(process.cwd(), "public", "downloads", fileName);

        // Create a readable stream from the video
        const videoStream = ytdl(url, { format });

        // Convert stream to buffer
        const chunks = [];
        for await (const chunk of videoStream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Write the buffer to a file
        await writeFile(filePath, buffer);

        // Return the download URL and video title
        return {
          downloadUrl: `/downloads/${fileName}`,
          title: videoTitle,
        };
      } catch (error) {
        console.error("YouTube download error:", error);
        return {
          error:
            "Failed to process YouTube video. Please check the URL and try again.",
        };
      }
    } else {
      return {
        error:
          "Unsupported video URL. Currently only YouTube videos are supported.",
      };
    }
  } catch (error) {
    console.error("Download error:", error);
    return { error: "An error occurred while processing your request." };
  }
}
