"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Download,
  LinkIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a video URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setDownloadReady(false);
      setVideoInfo(null);

      const formData = new FormData();
      formData.append("url", url);

      // Send POST request to your backend
      const response = await fetch(
        "https://vid-downloadbackend.ibrahimdev.cloud/",
        {
          method: "POST",
          body: formData,
        }
      );

      // Check if the response is JSON (error) or a file (success)
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // It's an error response
        const errorData = await response.json();
        setError(errorData.error || "Failed to process video");
        return;
      }

      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "video.mp4";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create an object URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);

      setVideoInfo({
        title: filename,
        downloadUrl,
        blob,
      });

      setDownloadReady(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoInfo || !videoInfo.downloadUrl) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = videoInfo.downloadUrl;
    a.download = videoInfo.title || "video.mp4";
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(videoInfo.downloadUrl);
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setUrl("");
    setDownloadReady(false);
    setVideoInfo(null);
    setError(null);

    // Clean up any object URLs
    if (videoInfo && videoInfo.downloadUrl) {
      window.URL.revokeObjectURL(videoInfo.downloadUrl);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Download Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-gray-400" />
            <Input
              type="url"
              placeholder="Paste video URL here (YouTube, Vimeo, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading || downloadReady}
              className="flex-1"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {downloadReady && videoInfo && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Ready to download:{" "}
                <span className="font-medium">{videoInfo.title}</span>
                <span className="block text-sm text-gray-500">
                  File size: {(videoInfo.blob.size / (1024 * 1024)).toFixed(2)}{" "}
                  MB
                </span>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {downloadReady ? (
          <>
            <Button
              variant="outline"
              onClick={handleReset}
              className="transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95"
            >
              Download Another
            </Button>
            <Button
              onClick={handleDownload}
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-green-600 active:scale-95"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Now
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || !url}
            className={`ml-auto transition-all duration-300 ${
              isLoading || !url
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-600 hover:scale-105 hover:shadow-lg active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Download Video"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
