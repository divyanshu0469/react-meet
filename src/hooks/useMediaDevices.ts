import { useCallback, useEffect, useRef, useState } from "react";
import {
  DeviceList,
  SelectedDevices,
  MediaState,
  MediaDeviceHookReturn,
  MediaDeviceInfo,
} from "../types";

/**
 * Custom hook for managing media devices (cameras, microphones, speakers)
 * and media streams. Provides easy-to-use functions for device enumeration,
 * selection, and media stream control.
 */
export const useMediaDevices = (): MediaDeviceHookReturn => {
  const currentStream = useRef<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [devices, setDevices] = useState<DeviceList>({
    cameras: [],
    microphones: [],
    speakers: [],
  });

  const [selectedDevices, setSelectedDevices] = useState<SelectedDevices>({
    camera: "",
    microphone: "",
    speaker: "",
  });

  const [mediaState, setMediaState] = useState<MediaState>({
    cameraOn: false,
    microphoneOn: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Device enumeration functions
  const getAllCameras = useCallback((): MediaDeviceInfo[] => {
    return devices.cameras;
  }, [devices.cameras]);

  const getAllMicrophones = useCallback((): MediaDeviceInfo[] => {
    return devices.microphones;
  }, [devices.microphones]);

  const getAllSpeakers = useCallback((): MediaDeviceInfo[] => {
    return devices.speakers;
  }, [devices.speakers]);

  const getCurrentCamera = useCallback((): MediaDeviceInfo | undefined => {
    return devices.cameras.find(
      (camera) => camera.deviceId === selectedDevices.camera
    );
  }, [devices.cameras, selectedDevices.camera]);

  const getCurrentMicrophone = useCallback((): MediaDeviceInfo | undefined => {
    return devices.microphones.find(
      (mic) => mic.deviceId === selectedDevices.microphone
    );
  }, [devices.microphones, selectedDevices.microphone]);

  const getCurrentSpeaker = useCallback((): MediaDeviceInfo | undefined => {
    return devices.speakers.find(
      (speaker) => speaker.deviceId === selectedDevices.speaker
    );
  }, [devices.speakers, selectedDevices.speaker]);

  // Media stream management
  const getMediaStream = useCallback(
    async (
      includeVideo: boolean = false,
      includeAudio: boolean = false
    ): Promise<MediaStream | null> => {
      if (!navigator.mediaDevices?.getUserMedia) {
        return null;
      }

      try {
        const constraints: MediaStreamConstraints = {};

        if (includeVideo) {
          constraints.video = selectedDevices.camera
            ? { deviceId: { exact: selectedDevices.camera } }
            : { width: { ideal: 1920 }, height: { ideal: 1080 } };
        }

        if (includeAudio) {
          constraints.audio = selectedDevices.microphone
            ? { deviceId: { exact: selectedDevices.microphone } }
            : { echoCancellation: true, noiseSuppression: true };
        }

        // Stop existing stream before creating new one
        if (currentStream.current) {
          currentStream.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        currentStream.current = stream;

        // Update media state based on actual tracks
        setMediaState((prev) => ({
          ...prev,
          cameraOn: includeVideo && stream.getVideoTracks().length > 0,
          microphoneOn: includeAudio && stream.getAudioTracks().length > 0,
        }));

        return stream;
      } catch (err) {
        const errorMessages: Record<string, string> = {
          NotFoundError: "Device not found",
          NotAllowedError: "Permission denied",
          OverconstrainedError: "Device constraints not supported",
        };
        const message = errorMessages[(err as Error).name] || "Unknown error";
        setError(message);
        return null;
      }
    },
    [selectedDevices]
  );

  // Device refresh function
  const refreshDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();

      const cameras = deviceList.filter(
        (device) => device.kind === "videoinput"
      );
      const microphones = deviceList.filter(
        (device) => device.kind === "audioinput"
      );
      const speakers = deviceList.filter(
        (device) => device.kind === "audiooutput"
      );

      setDevices((prevDevices) => {
        const devicesChanged =
          prevDevices.cameras.length !== cameras.length ||
          prevDevices.microphones.length !== microphones.length ||
          prevDevices.speakers.length !== speakers.length ||
          !cameras.every((cam) =>
            prevDevices.cameras.some((prev) => prev.deviceId === cam.deviceId)
          ) ||
          !microphones.every((mic) =>
            prevDevices.microphones.some(
              (prev) => prev.deviceId === mic.deviceId
            )
          ) ||
          !speakers.every((spk) =>
            prevDevices.speakers.some((prev) => prev.deviceId === spk.deviceId)
          );

        if (devicesChanged) {
          setSelectedDevices((prevSelected) => {
            const newSelected = { ...prevSelected };

            // Auto-select first available device if none selected or previously selected device is gone
            if (
              !isInitialized ||
              !cameras.some((cam) => cam.deviceId === prevSelected.camera)
            ) {
              newSelected.camera = cameras[0]?.deviceId || "";
            }

            if (
              !isInitialized ||
              !microphones.some(
                (mic) => mic.deviceId === prevSelected.microphone
              )
            ) {
              newSelected.microphone = microphones[0]?.deviceId || "";
            }

            if (
              !isInitialized ||
              !speakers.some((spk) => spk.deviceId === prevSelected.speaker)
            ) {
              newSelected.speaker = speakers[0]?.deviceId || "";
            }

            return newSelected;
          });

          if (!isInitialized) {
            setIsInitialized(true);
          }
        }

        return { cameras, microphones, speakers };
      });
    } catch (err) {
      setError("Failed to enumerate devices");
    }
  }, [isInitialized]);

  // Device change handlers
  const handleCameraChange = useCallback(
    async (deviceId: string) => {
      setSelectedDevices((prev) => ({ ...prev, camera: deviceId }));

      if (mediaState.cameraOn) {
        await getMediaStream(true, mediaState.microphoneOn);
      }
    },
    [mediaState.cameraOn, mediaState.microphoneOn, getMediaStream]
  );

  const handleMicrophoneChange = useCallback(
    async (deviceId: string) => {
      setSelectedDevices((prev) => ({ ...prev, microphone: deviceId }));

      if (mediaState.microphoneOn) {
        await getMediaStream(mediaState.cameraOn, true);
      }
    },
    [mediaState.cameraOn, mediaState.microphoneOn, getMediaStream]
  );

  const handleSpeakerChange = useCallback(async (deviceId: string) => {
    setSelectedDevices((prev) => ({ ...prev, speaker: deviceId }));

    // If there's an audio element with setSinkId support, change the output
    const audioElements = document.querySelectorAll("audio");
    for (const audio of audioElements) {
      if ("setSinkId" in audio) {
        try {
          await (audio as HTMLAudioElement).setSinkId(deviceId);
        } catch (err) {
          setError("Failed to set audio output device");
        }
      }
    }
  }, []);

  // Toggle functions
  const toggleCamera = useCallback(async () => {
    if (!mediaState.cameraOn) {
      await getMediaStream(true, mediaState.microphoneOn);
    } else {
      currentStream.current?.getVideoTracks().forEach((track) => track.stop());
      setMediaState((prev) => ({ ...prev, cameraOn: false }));

      if (mediaState.microphoneOn) {
        await getMediaStream(false, true);
      }
    }
  }, [mediaState.cameraOn, mediaState.microphoneOn, getMediaStream]);

  const toggleMicrophone = useCallback(async () => {
    if (!mediaState.microphoneOn) {
      await getMediaStream(mediaState.cameraOn, true);
    } else {
      currentStream.current?.getAudioTracks().forEach((track) => track.stop());
      setMediaState((prev) => ({ ...prev, microphoneOn: false }));

      if (mediaState.cameraOn) {
        await getMediaStream(true, false);
      }
    }
  }, [mediaState.cameraOn, mediaState.microphoneOn, getMediaStream]);

  // Utility function to stop all tracks
  const stopAllTracks = useCallback(() => {
    if (currentStream.current) {
      currentStream.current.getTracks().forEach((track) => track.stop());
      currentStream.current = null;
    }
    setMediaState((prev) => ({
      ...prev,
      cameraOn: false,
      microphoneOn: false,
    }));
  }, []);

  // Initialize devices and listen for device changes
  useEffect(() => {
    refreshDevices();

    const handleDeviceChange = () => {
      refreshDevices();
    };

    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener(
        "devicechange",
        handleDeviceChange
      );

      return () => {
        navigator.mediaDevices.removeEventListener(
          "devicechange",
          handleDeviceChange
        );
      };
    }
  }, [refreshDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllTracks();
    };
  }, [stopAllTracks]);

  return {
    devices,
    selectedDevices,
    mediaState,
    currentStream: currentStream.current,
    getMediaStream,
    getAllCameras,
    getAllMicrophones,
    getAllSpeakers,
    getCurrentCamera,
    getCurrentMicrophone,
    getCurrentSpeaker,
    handleCameraChange,
    handleMicrophoneChange,
    handleSpeakerChange,
    toggleCamera,
    toggleMicrophone,
    refreshDevices,
    stopAllTracks,
    error,
  };
};

export default useMediaDevices;
