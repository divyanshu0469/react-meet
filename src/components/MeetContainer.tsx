import { XIcon } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { useMediaDevices } from "../hooks/useMediaDevices";
import { useState } from "react";
import WebcamToolBar from "./WebcamToolBar";
import WebcamSettings from "./WebcamSettings";
import { CameraSettings } from "../types";
import { motion } from "motion/react";
import WebcamOverlay from "./WebcamOverlay";
import ParticipantOverlay from "./ParticipantOverlay";

/**
 * Main container component for the meeting interface.
 * Handles local and remote streams, settings, and UI controls.
 *
 * @param props - Component properties
 * @param props.remoteParticipants - Optional array of remote participants with their IDs, streams, and names
 */
const MeetContainer = ({
  remoteParticipants = [],
}: {
  remoteParticipants?: Array<{ id: string; stream: MediaStream; name: string }>;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [shareScreenOn, setShareScreenOn] = useState(false);
  const [raiseHandOn, setRaiseHandOn] = useState(false);
  const [isSideContainerOpen, setIsSideContainerOpen] = useState(false);
  const [pinnedStreams, setPinnedStreams] = useState<string | undefined>();

  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    flip: false,
    rotate: false,
    ratio: false,
  });

  const {
    devices,
    selectedDevices,
    mediaState,
    currentStream,
    getMediaStream,
    handleCameraChange,
    handleMicrophoneChange,
    handleSpeakerChange,
    toggleCamera: hookToggleCamera,
    toggleMicrophone: hookToggleMicrophone,
  } = useMediaDevices();

  const { cameraOn, microphoneOn } = mediaState;

  const applyCameraSettings = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      video: HTMLVideoElement
    ) => {
      const { flip, rotate, ratio } = cameraSettings;

      // Check if video has valid dimensions
      if (!video.videoWidth || !video.videoHeight) {
        return;
      }

      // Set canvas dimensions based on ratio setting first
      let drawWidth = video.videoWidth;
      let drawHeight = video.videoHeight;

      if (ratio === "video") {
        // 16:9 aspect ratio
        const aspectRatio = 16 / 9;
        if (drawWidth / drawHeight > aspectRatio) {
          drawHeight = drawWidth / aspectRatio;
        } else {
          drawWidth = drawHeight * aspectRatio;
        }
      } else if (ratio === "square") {
        // 1:1 aspect ratio
        const size = Math.min(drawWidth, drawHeight);
        drawWidth = size;
        drawHeight = size;
      }

      // Set canvas size based on rotation - swap dimensions for 90/270 degree rotations
      if (rotate === 90 || rotate === 270) {
        canvas.width = drawHeight;
        canvas.height = drawWidth;
      } else {
        canvas.width = drawWidth;
        canvas.height = drawHeight;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Move to center of canvas for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Apply rotation
      if (rotate === 90) {
        ctx.rotate((90 * Math.PI) / 180);
      } else if (rotate === 180) {
        ctx.rotate(Math.PI);
      } else if (rotate === 270) {
        ctx.rotate((270 * Math.PI) / 180);
      }

      // Apply flip (horizontal mirror)
      if (flip) {
        ctx.scale(-1, 1);
      }

      // Draw the video centered
      ctx.drawImage(
        video,
        -video.videoWidth / 2,
        -video.videoHeight / 2,
        video.videoWidth,
        video.videoHeight
      );

      // Restore context state
      ctx.restore();
    },
    [cameraSettings]
  );

  const toggleCamera = async () => {
    if (!cameraOn) {
      const stream = await getMediaStream(true, microphoneOn);
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
        // Start drawing on canvas
        if (videoRef.current && canvasRef.current) {
          const startDrawing = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");

            if (
              ctx &&
              video &&
              canvas &&
              video.videoWidth &&
              video.videoHeight
            ) {
              applyCameraSettings(ctx, canvas, video);
            }
            animationFrameRef.current = requestAnimationFrame(startDrawing);
          };
          startDrawing();
        }
      }
    } else {
      if (videoRef.current) videoRef.current.srcObject = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      await hookToggleCamera();
    }
  };

  const toggleMicrophone = async () => {
    if (!microphoneOn) {
      const stream = await getMediaStream(cameraOn, true);
      if (stream && audioRef.current) {
        audioRef.current.srcObject = stream;
      }
    } else {
      if (audioRef.current) audioRef.current.srcObject = null;
      await hookToggleMicrophone();
    }
  };

  const toggleShareScreen = () => {
    setShareScreenOn(!shareScreenOn);
  };

  const toggleRaiseHand = () => {
    setRaiseHandOn(!raiseHandOn);
  };

  const toggleSideContainer = () => {
    setIsSideContainerOpen(!isSideContainerOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const togglePin = (socketId: string) => {
    setPinnedStreams((prev) => (prev === socketId ? undefined : socketId));
  };

  const handleDeviceChangeWrapper = async (
    deviceId: string,
    deviceType: "camera" | "microphone" | "speaker"
  ) => {
    if (deviceType === "camera") {
      await handleCameraChange(deviceId);
      // Reset camera settings when device changes
      setCameraSettings({
        flip: false,
        rotate: false,
        ratio: false,
      });
      if (cameraOn && videoRef.current) {
        const stream = await getMediaStream(true, microphoneOn);
        if (stream) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }
    } else if (deviceType === "microphone") {
      await handleMicrophoneChange(deviceId);
      if (microphoneOn && audioRef.current) {
        const stream = await getMediaStream(cameraOn, true);
        if (stream) {
          audioRef.current.srcObject = stream;
        }
      }
    } else if (deviceType === "speaker") {
      await handleSpeakerChange(deviceId);
      if (audioRef.current && "setSinkId" in audioRef.current) {
        try {
          await (audioRef.current as HTMLAudioElement).setSinkId(deviceId);
        } catch (err) {
          // Failed to set speaker, handle silently or log
        }
      }
    }
  };

  useEffect(() => {
    if (currentStream) {
      if (cameraOn && videoRef.current) {
        videoRef.current.srcObject = currentStream;
        videoRef.current.play();
      }
      if (microphoneOn && audioRef.current) {
        audioRef.current.srcObject = currentStream;
      }
    }
  }, [currentStream, cameraOn, microphoneOn]);

  // Effect to restart animation loop when camera settings change
  useEffect(() => {
    if (cameraOn && videoRef.current && canvasRef.current) {
      // Cancel existing animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Start new animation loop with updated settings
      const startDrawing = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && video && canvas && video.videoWidth && video.videoHeight) {
          applyCameraSettings(ctx, canvas, video);
        }
        animationFrameRef.current = requestAnimationFrame(startDrawing);
      };
      startDrawing();
    }
  }, [cameraSettings, cameraOn, applyCameraSettings]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-w-[300px] min-h-[300px] p-4 bg-dark flex flex-col items-center justify-center gap-4 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center gap-4">
        <div className="relative w-full h-full flex items-center justify-center gap-4">
          <div className="absolute inset-0 flex items-center justify-center">
            {pinnedStreams ? (
              (() => {
                const pinnedParticipant = remoteParticipants.find(
                  (p) => p.id === pinnedStreams
                );
                if (!pinnedParticipant) return null;
                return (
                  <ParticipantOverlay
                    socketId={pinnedStreams}
                    name={pinnedParticipant.name}
                    stream={pinnedParticipant.stream}
                    isPinned={true}
                    onPin={() => togglePin(pinnedStreams)}
                  />
                );
              })()
            ) : remoteParticipants.length > 0 ? (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 pt-20 pb-32">
                {remoteParticipants.map((participant) => (
                  <ParticipantOverlay
                    key={participant.id}
                    socketId={participant.id}
                    name={participant.name}
                    stream={participant.stream}
                    isPinned={pinnedStreams === participant.id}
                    onPin={(socketId) => togglePin(socketId)}
                    className="w-full h-full object-contain rounded-xl bg-dark-gray"
                  />
                ))}
              </div>
            ) : null}
          </div>

          {remoteParticipants.length > 0 ? (
            <div className="absolute bottom-4 right-4 z-30">
              <WebcamOverlay
                videoRef={videoRef}
                audioRef={audioRef}
                canvasRef={canvasRef}
                cameraOn={cameraOn}
                cameraSettings={cameraSettings}
                raiseHandOn={raiseHandOn}
                pip
              />
            </div>
          ) : (
            <WebcamOverlay
              videoRef={videoRef}
              audioRef={audioRef}
              canvasRef={canvasRef}
              cameraOn={cameraOn}
              cameraSettings={cameraSettings}
              raiseHandOn={raiseHandOn}
            />
          )}
        </div>
        {isSideContainerOpen && (
          <motion.div
            initial={{ width: "0%", overflow: "hidden" }}
            animate={{ width: "50%", overflow: "hidden" }}
            transition={{
              duration: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="h-full p-4 bg-light rounded-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Title</h1>
              <button
                className="p-2 rounded-full bg-light hover:bg-light-hover text-dark cursor-pointer"
                onClick={toggleSideContainer}
              >
                <XIcon />
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <WebcamToolBar
        toggleMicrophone={toggleMicrophone}
        microphoneOn={microphoneOn}
        toggleCamera={toggleCamera}
        cameraOn={cameraOn}
        toggleShareScreen={toggleShareScreen}
        shareScreenOn={shareScreenOn}
        toggleRaiseHand={toggleRaiseHand}
        raiseHandOn={raiseHandOn}
        toggleSettings={toggleSettings}
        toggleSideContainer={toggleSideContainer}
      />
      <WebcamSettings
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        devices={devices}
        selectedDevices={selectedDevices}
        onDeviceChange={handleDeviceChangeWrapper}
        cameraSettings={cameraSettings}
        onCameraSettingsChange={setCameraSettings}
      />
    </div>
  );
};

MeetContainer.displayName = "MeetContainer";

export default MeetContainer;
