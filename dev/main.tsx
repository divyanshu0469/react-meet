import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../src/global.css";
import MeetContainer from "../src/components/MeetContainer";

// Create test MediaStreams from video URLs
const createTestStream = async (
  videoUrl: string
): Promise<MediaStream | null> => {
  try {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.src = videoUrl;

    await new Promise((resolve, reject) => {
      video.onloadeddata = resolve;
      video.onerror = reject;
      video.load();
    });

    await video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const drawFrame = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    };
    drawFrame();

    return canvas.captureStream(30);
  } catch (error) {
    console.error("Failed to create test stream:", error);
    return null;
  }
};

function DevApp() {
  const [remoteStreams, setRemoteStreams] = useState<
    Map<string, { stream: MediaStream; name: string }>
  >(new Map());

  useEffect(() => {
    const initTestStreams = async () => {
      const testVideos = [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      ];

      const streams = new Map<string, { stream: MediaStream; name: string }>();

      for (let i = 0; i < testVideos.length; i++) {
        const stream = await createTestStream(testVideos[i]);
        if (stream) {
          streams.set(`test-participant-${i + 1}`, {
            stream,
            name: `Participant ${i + 1}`,
          });
        }
      }

      setRemoteStreams(streams);
    };

    initTestStreams();
  }, []);

  return (
    <div className="w-screen h-screen">
      <MeetContainer remoteStreams={remoteStreams} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>
);
