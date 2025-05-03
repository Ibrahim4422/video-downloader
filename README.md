# 🎥 Video Downloader - Frontend

A sleek and minimalist UI that lets users paste a video link and download it directly to their device.

Built with **React** and **TailwindCSS**.

---

## 📸 Preview

![App Screenshot](./screenshot.png)

---

## 💡 Features

- Paste a link from YouTube, TikTok, Instagram, or others
- Submit the link to initiate download
- Responsive and minimalist UI
- 🔜 **Planned**: Select quality (HD / SD / Audio Only)

---

## 🛠 Tech Stack

- ⚛️ React (with Vite)
- 💨 Tailwind CSS
- 🎨 Lucide React Icons

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Ibrahim2122/video-downloader.git
cd video-downloader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Then visit:
👉 http://localhost:5173

### 🧱 Build for Production

```bash
npm run build
```

Build files will be in the dist/ folder.

---

## 📡 Backend Integration (Planned)

This frontend is being integrated with a FastAPI backend that will:

- Accept a video URL via POST
- Download the video using yt-dlp
- Return the file as a downloadable response

---

### Planned API:

```http
POST /download
Content-Type: application/x-www-form-urlencoded

url=https://example.com/video
```

Response: video/mp4 or download stream

## 👨‍💻 Author

Made with ❤️ by @Ibrahim2122
