import { useEffect, useRef } from "react";
import WebcamButton from "./WebcamButton";
import { PinIcon, PinOffIcon } from "lucide-react";

const ParticipantOverlay = ({
  name,
  stream,
  socketId,
  className,
  isPinned,
  onPin,
}: {
  socketId: string;
  name: string;
  stream: MediaStream;
  className?: string;
  isPinned?: boolean;
  onPin?: (socketId: string) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.srcObject = stream;
    videoElement.play().catch(() => {});
  }, [stream]);
  return (
    <div className="relative group w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={
          className ?? "w-full h-full object-contain rounded-xl bg-dark-gray"
        }
      />
      <div className="hidden group-hover:flex absolute inset-0 items-center justify-center text-white font-extralight">
        <WebcamButton
          icon
          className="bg-dark/50"
          onClick={() => onPin?.(socketId)}
        >
          {isPinned ? <PinOffIcon /> : <PinIcon />}
        </WebcamButton>
      </div>
      <div className="absolute left-2 bottom-2 flex gap-2 items-center text-light">
        <span className="p-2">{name}</span>
      </div>
    </div>
  );
};

export default ParticipantOverlay;
