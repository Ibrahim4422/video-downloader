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
import { downloadVideo } from "@/app/actions";
import {
  Loader2,
  Download,
  LinkIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Add this custom style
const buttonStyle = {
  transition: "all 0.3s ease",
};

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url) {
      setError("Please enter a video URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setDownloadUrl(null);

      const result = await downloadVideo(url);

      if (result.error) {
        setError(result.error);
      } else if (result.downloadUrl && result.title) {
        setDownloadUrl(result.downloadUrl);
        setVideoTitle(result.title);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setDownloadUrl(null);
    setVideoTitle(null);
    setError(null);
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
              disabled={isLoading || !!downloadUrl}
              className="flex-1"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {downloadUrl && videoTitle && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Ready to download:{" "}
                <span className="font-medium">{videoTitle}</span>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {downloadUrl ? (
          <>
            <Button
              variant="outline"
              onClick={handleReset}
              className="transition-all duration-300 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95"
            >
              Download Another
            </Button>
            <a href={downloadUrl} download={videoTitle || "video"}>
              <Button className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-green-600 active:scale-95">
                <Download className="mr-2 h-4 w-4" />
                Download Now
              </Button>
            </a>
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
