import VideoDownloader from "@/components/video-downloader";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Video Downloader
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Paste a video URL to download it to your device
        </p>
        <VideoDownloader />
      </div>
    </main>
  );
}
