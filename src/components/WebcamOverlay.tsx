import { HandIcon } from "lucide-react";
import { CameraSettings } from "../types";

interface WebcamOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraOn: boolean;
  cameraSettings: CameraSettings;
  raiseHandOn: boolean;
  pip?: boolean;
}

const WebcamOverlay = ({
  videoRef,
  audioRef,
  canvasRef,
  cameraOn,
  cameraSettings,
  raiseHandOn,
  pip = false,
}: WebcamOverlayProps) => {
  return (
    <div
      className={[
        "relative overflow-hidden bg-dark-gray",
        pip
          ? "rounded-xl w-72 max-w-[40vw] aspect-video h-auto shadow-lg z-20 border-2 border-dark"
          : "flex flex-col items-center justify-center w-3/4 max-xl:w-full h-full min-w-[300px] min-h-[300px] rounded-2xl",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <video ref={videoRef} className="hidden" />
      <audio ref={audioRef} className="hidden" />
      <canvas
        ref={canvasRef}
        style={{ display: cameraOn ? "block" : "none" }}
        className={`absolute w-full h-full object-cover ${
          cameraSettings.ratio
            ? cameraSettings.ratio === "video"
              ? "aspect-video"
              : "aspect-square"
            : "h-full"
        }`}
      />
      {!cameraOn ? (
        <div className="absolute inset-0 flex items-center justify-center text-white font-extralight">
          Camera off
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white font-extralight"></div>
      )}
      <div className="absolute left-2 bottom-2 flex gap-2 items-center text-light">
        <span className="p-2">You</span>
        {raiseHandOn && (
          <div className="bg-blue flex items-center gap-1 p-2 rounded-full">
            <HandIcon className="w-4 h-4" />
            <span className="text-xs">Raising Hand</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamOverlay;
