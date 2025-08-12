// Main library exports
export { default as MeetContainer } from "./components/MeetContainer";
export { default as WebcamSettings } from "./components/WebcamSettings";
export { default as WebcamToolBar } from "./components/WebcamToolBar";
export { default as ParticipantOverlay } from "./components/ParticipantOverlay";
export { default as SlideTabs } from "./components/SlideTabs";
export { default as SlideToggle } from "./components/SlideToggle";
export { default as WebcamButton } from "./components/WebcamButton";
export { default as WebcamOverlay } from "./components/WebcamOverlay";

// Types
export * from "./types";

// Hooks
export { useMediaDevices } from "./hooks/useMediaDevices";
export { useOptional } from "./hooks/useOptional";

// Utilities - Individual device functions
export {
  getAllCameras,
  getAllMicrophones,
  getAllSpeakers,
  getAllDevices,
  getDefaultCamera,
  getDefaultMicrophone,
  getDefaultSpeaker,
  getCameraById,
  getMicrophoneById,
  getSpeakerById,
  createMediaStream,
  stopMediaStream,
  setAudioOutputDevice,
  isMediaDevicesSupported,
  isDeviceEnumerationSupported,
  isAudioOutputSelectionSupported,
  getMediaPermissions,
  requestMediaPermissions,
  onDeviceChange,
} from "./utils/mediaDeviceUtils";

// Utility class
export { default as MediaDeviceUtils } from "./utils/mediaDeviceUtils";

// Import global styles
import "./global.css";
