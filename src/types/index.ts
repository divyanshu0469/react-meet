// Device types - using native MediaDeviceInfo
/**
 * Type alias for the native MediaDeviceInfo interface.
 */
export type MediaDeviceInfo = globalThis.MediaDeviceInfo;

/**
 * Structure containing lists of available media devices categorized by type.
 */
export interface DeviceList {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}

/**
 * Selected device IDs for camera, microphone, and speaker.
 */
export interface SelectedDevices {
  camera: string;
  microphone: string;
  speaker: string;
}

/**
 * Current state of media toggles.
 */
export interface MediaState {
  cameraOn: boolean;
  microphoneOn: boolean;
}

/**
 * Settings for camera transformations and aspect ratio.
 */
export interface CameraSettings {
  flip: boolean;
  rotate: false | 90 | 180 | 270;
  ratio: false | "video" | "square";
}

/**
 * Return type for the useMediaDevices hook, providing device management and stream control.
 */
export interface MediaDeviceHookReturn {
  // Device lists
  devices: DeviceList;
  selectedDevices: SelectedDevices;

  // Media state
  mediaState: MediaState;

  // Stream management
  currentStream: MediaStream | null;
  getMediaStream: (
    includeVideo?: boolean,
    includeAudio?: boolean
  ) => Promise<MediaStream | null>;

  // Device operations
  getAllCameras: () => MediaDeviceInfo[];
  getAllMicrophones: () => MediaDeviceInfo[];
  getAllSpeakers: () => MediaDeviceInfo[];
  getCurrentCamera: () => MediaDeviceInfo | undefined;
  getCurrentMicrophone: () => MediaDeviceInfo | undefined;
  getCurrentSpeaker: () => MediaDeviceInfo | undefined;
  handleCameraChange: (deviceId: string) => Promise<void>;
  handleMicrophoneChange: (deviceId: string) => Promise<void>;
  handleSpeakerChange: (deviceId: string) => Promise<void>;

  // Toggle functions
  toggleCamera: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;

  // Utility functions
  refreshDevices: () => Promise<void>;
  stopAllTracks: () => void;

  // Error state
  error: string | null;
}

/**
 * Options for media stream constraints.
 */
export interface MediaConstraintsOptions {
  video?: {
    width?: { ideal: number };
    height?: { ideal: number };
    deviceId?: { exact: string };
  };
  audio?: {
    deviceId?: { exact: string };
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
}

/**
 * State for optional meeting features.
 */
export interface OptionalState {
  shareScreenOn: boolean;
  raiseHandOn: boolean;
  openChat: boolean;
  openMembersList: boolean;
}

/**
 * Return type for the useOptional hook, providing controls for optional features.
 */
export interface OptionalHookReturn {
  // Optional state
  optionalState: OptionalState;

  // Toggle functions
  toggleShareScreen: () => void;
  toggleRaiseHand: () => void;
  toggleOpenChat: () => void;
  toggleOpenMembersList: () => void;

  // Individual state setters
  setShareScreen: (value: boolean) => void;
  setRaiseHand: (value: boolean) => void;
  setOpenChat: (value: boolean) => void;
  setOpenMembersList: (value: boolean) => void;
}
