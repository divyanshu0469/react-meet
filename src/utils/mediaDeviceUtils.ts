import type { MediaDeviceInfo } from "../types";

/**
 * Utility functions for media device operations.
 * These can be imported and used individually without the hook.
 */

/**
 * Get all available cameras (video input devices)
 */
export const getAllCameras = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  } catch (error) {
    console.error("Failed to get cameras:", error);
    return [];
  }
};

/**
 * Get all available microphones (audio input devices)
 */
export const getAllMicrophones = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audioinput");
  } catch (error) {
    console.error("Failed to get microphones:", error);
    return [];
  }
};

/**
 * Get all available speakers (audio output devices)
 */
export const getAllSpeakers = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "audiooutput");
  } catch (error) {
    console.error("Failed to get speakers:", error);
    return [];
  }
};

/**
 * Get all available media devices grouped by type
 */
export const getAllDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const cameras = devices.filter((device) => device.kind === "videoinput");
    const microphones = devices.filter(
      (device) => device.kind === "audioinput"
    );
    const speakers = devices.filter((device) => device.kind === "audiooutput");

    return { cameras, microphones, speakers };
  } catch (error) {
    console.error("Failed to get devices:", error);
    return { cameras: [], microphones: [], speakers: [] };
  }
};

/**
 * Get the default camera device
 */
export const getDefaultCamera = async (): Promise<MediaDeviceInfo | null> => {
  const cameras = await getAllCameras();
  return cameras[0] || null;
};

/**
 * Get the default microphone device
 */
export const getDefaultMicrophone =
  async (): Promise<MediaDeviceInfo | null> => {
    const microphones = await getAllMicrophones();
    return microphones[0] || null;
  };

/**
 * Get the default speaker device
 */
export const getDefaultSpeaker = async (): Promise<MediaDeviceInfo | null> => {
  const speakers = await getAllSpeakers();
  return speakers[0] || null;
};

/**
 * Get a specific camera by device ID
 */
export const getCameraById = async (
  deviceId: string
): Promise<MediaDeviceInfo | null> => {
  const cameras = await getAllCameras();
  return cameras.find((camera) => camera.deviceId === deviceId) || null;
};

/**
 * Get a specific microphone by device ID
 */
export const getMicrophoneById = async (
  deviceId: string
): Promise<MediaDeviceInfo | null> => {
  const microphones = await getAllMicrophones();
  return microphones.find((mic) => mic.deviceId === deviceId) || null;
};

/**
 * Get a specific speaker by device ID
 */
export const getSpeakerById = async (
  deviceId: string
): Promise<MediaDeviceInfo | null> => {
  const speakers = await getAllSpeakers();
  return speakers.find((speaker) => speaker.deviceId === deviceId) || null;
};

/**
 * Create media stream with specified constraints
 */
export const createMediaStream = async (options: {
  video?: boolean | { deviceId?: string; width?: number; height?: number };
  audio?:
    | boolean
    | {
        deviceId?: string;
        echoCancellation?: boolean;
        noiseSuppression?: boolean;
      };
}): Promise<MediaStream | null> => {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("getUserMedia is not supported");
    return null;
  }

  try {
    const constraints: MediaStreamConstraints = {};

    if (options.video) {
      if (typeof options.video === "boolean") {
        constraints.video = { width: { ideal: 1920 }, height: { ideal: 1080 } };
      } else {
        constraints.video = {
          ...(options.video.deviceId
            ? { deviceId: { exact: options.video.deviceId } }
            : {}),
          ...(options.video.width
            ? { width: { ideal: options.video.width } }
            : {}),
          ...(options.video.height
            ? { height: { ideal: options.video.height } }
            : {}),
        };
      }
    }

    if (options.audio) {
      if (typeof options.audio === "boolean") {
        constraints.audio = { echoCancellation: true, noiseSuppression: true };
      } else {
        constraints.audio = {
          ...(options.audio.deviceId
            ? { deviceId: { exact: options.audio.deviceId } }
            : {}),
          echoCancellation: options.audio.echoCancellation ?? true,
          noiseSuppression: options.audio.noiseSuppression ?? true,
        };
      }
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error("Failed to create media stream:", error);
    return null;
  }
};

/**
 * Stop all tracks in a media stream
 */
export const stopMediaStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};

/**
 * Change the audio output device for an audio element
 */
export const setAudioOutputDevice = async (
  audioElement: HTMLAudioElement,
  deviceId: string
): Promise<boolean> => {
  if (!("setSinkId" in audioElement)) {
    console.warn("setSinkId is not supported");
    return false;
  }

  try {
    await (audioElement as any).setSinkId(deviceId);
    return true;
  } catch (error) {
    console.error("Failed to set audio output device:", error);
    return false;
  }
};

/**
 * Check if media devices API is supported
 */
export const isMediaDevicesSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Check if device enumeration is supported
 */
export const isDeviceEnumerationSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
};

/**
 * Check if audio output selection is supported
 */
export const isAudioOutputSelectionSupported = (): boolean => {
  const audio = document.createElement("audio");
  return "setSinkId" in audio;
};

/**
 * Get media permissions status
 */
export const getMediaPermissions = async (): Promise<{
  camera: PermissionState;
  microphone: PermissionState;
}> => {
  try {
    const cameraPermission = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });
    const microphonePermission = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    return {
      camera: cameraPermission.state,
      microphone: microphonePermission.state,
    };
  } catch (error) {
    console.error("Failed to get media permissions:", error);
    return {
      camera: "prompt" as PermissionState,
      microphone: "prompt" as PermissionState,
    };
  }
};

/**
 * Request media permissions
 */
export const requestMediaPermissions = async (
  video: boolean = true,
  audio: boolean = true
): Promise<boolean> => {
  try {
    const stream = await createMediaStream({ video, audio });
    if (stream) {
      stopMediaStream(stream);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to request media permissions:", error);
    return false;
  }
};

/**
 * Listen for device changes
 */
export const onDeviceChange = (callback: () => void): (() => void) => {
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
    navigator.mediaDevices.addEventListener("devicechange", callback);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", callback);
    };
  }

  return () => {}; // Return empty cleanup function if not supported
};

export default {
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
};
