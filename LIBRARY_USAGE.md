# React Meet - Media Device Library

A comprehensive React library for managing media devices (cameras, microphones, speakers) with both hook-based and utility-based approaches.

## Installation

```bash
npm install react-meet
```

## Quick Start

### 1. Using the Hook Approach (Recommended)

The `useMediaDevices` hook provides a complete solution for device management:

```tsx
import React from "react";
import { useMediaDevices } from "react-meet";

function VideoComponent() {
  const {
    devices,
    selectedDevices,
    mediaState,
    toggleCamera,
    toggleMicrophone,
    handleCameraChange,
    handleMicrophoneChange,
    getCurrentCamera,
    getCurrentMicrophone,
  } = useMediaDevices();

  return (
    <div>
      {/* Media Controls */}
      <button onClick={toggleCamera}>
        {mediaState.cameraOn ? "Turn Camera OFF" : "Turn Camera ON"}
      </button>

      <button onClick={toggleMicrophone}>
        {mediaState.microphoneOn ? "Turn Microphone OFF" : "Turn Microphone ON"}
      </button>

      {/* Device Selection */}
      <select
        value={selectedDevices.camera}
        onChange={(e) => handleCameraChange(e.target.value)}
      >
        {devices.cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || "Unknown Camera"}
          </option>
        ))}
      </select>

      <select
        value={selectedDevices.microphone}
        onChange={(e) => handleMicrophoneChange(e.target.value)}
      >
        {devices.microphones.map((mic) => (
          <option key={mic.deviceId} value={mic.deviceId}>
            {mic.label || "Unknown Microphone"}
          </option>
        ))}
      </select>

      {/* Display Current Device Info */}
      <div>
        <p>Current Camera: {getCurrentCamera()?.label || "None"}</p>
        <p>Current Microphone: {getCurrentMicrophone()?.label || "None"}</p>
      </div>
    </div>
  );
}
```

### 2. Using Individual Utility Functions

For more granular control, you can import individual functions:

```tsx
import React, { useEffect, useState } from "react";
import {
  getAllCameras,
  getAllMicrophones,
  createMediaStream,
  stopMediaStream,
  MediaDeviceInfo,
} from "react-meet";

function CustomVideoComponent() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Load available cameras
  useEffect(() => {
    const loadCameras = async () => {
      const cameraList = await getAllCameras();
      setCameras(cameraList);
      if (cameraList.length > 0) {
        setSelectedCamera(cameraList[0].deviceId);
      }
    };
    loadCameras();
  }, []);

  // Start video stream
  const startVideo = async () => {
    if (stream) {
      stopMediaStream(stream);
    }

    const newStream = await createMediaStream({
      video: { deviceId: selectedCamera },
      audio: true,
    });

    setStream(newStream);
  };

  return (
    <div>
      <select
        value={selectedCamera}
        onChange={(e) => setSelectedCamera(e.target.value)}
      >
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || "Unknown Camera"}
          </option>
        ))}
      </select>

      <button onClick={startVideo}>Start Video</button>
      <button
        onClick={() => {
          if (stream) {
            stopMediaStream(stream);
            setStream(null);
          }
        }}
      >
        Stop Video
      </button>
    </div>
  );
}
```

## API Reference

### Hook: useMediaDevices()

Returns an object with the following properties:

#### Device Lists

- `devices.cameras: MediaDeviceInfo[]` - Available cameras
- `devices.microphones: MediaDeviceInfo[]` - Available microphones
- `devices.speakers: MediaDeviceInfo[]` - Available speakers

#### Current Selections

- `selectedDevices.camera: string` - Currently selected camera ID
- `selectedDevices.microphone: string` - Currently selected microphone ID
- `selectedDevices.speaker: string` - Currently selected speaker ID

#### Media State

- `mediaState.cameraOn: boolean` - Camera on/off status
- `mediaState.microphoneOn: boolean` - Microphone on/off status
- `mediaState.shareScreenOn: boolean` - Screen share status
- `mediaState.raiseHandOn: boolean` - Raise hand status

#### Functions

- `toggleCamera()` - Toggle camera on/off
- `toggleMicrophone()` - Toggle microphone on/off
- `handleCameraChange(deviceId: string)` - Change camera device
- `handleMicrophoneChange(deviceId: string)` - Change microphone device
- `handleSpeakerChange(deviceId: string)` - Change speaker device
- `getCurrentCamera()` - Get current camera info
- `getCurrentMicrophone()` - Get current microphone info
- `getCurrentSpeaker()` - Get current speaker info
- `refreshDevices()` - Refresh device list

### Utility Functions

#### Device Enumeration

- `getAllCameras(): Promise<MediaDeviceInfo[]>`
- `getAllMicrophones(): Promise<MediaDeviceInfo[]>`
- `getAllSpeakers(): Promise<MediaDeviceInfo[]>`
- `getAllDevices(): Promise<{cameras, microphones, speakers}>`

#### Device Selection

- `getDefaultCamera(): Promise<MediaDeviceInfo | null>`
- `getDefaultMicrophone(): Promise<MediaDeviceInfo | null>`
- `getDefaultSpeaker(): Promise<MediaDeviceInfo | null>`
- `getCameraById(deviceId: string): Promise<MediaDeviceInfo | null>`
- `getMicrophoneById(deviceId: string): Promise<MediaDeviceInfo | null>`
- `getSpeakerById(deviceId: string): Promise<MediaDeviceInfo | null>`

#### Stream Management

- `createMediaStream(options): Promise<MediaStream | null>`
- `stopMediaStream(stream: MediaStream | null): void`

#### Permissions & Support

- `isMediaDevicesSupported(): boolean`
- `isDeviceEnumerationSupported(): boolean`
- `isAudioOutputSelectionSupported(): boolean`
- `getMediaPermissions(): Promise<{camera, microphone}>`
- `requestMediaPermissions(video?, audio?): Promise<boolean>`

#### Event Handling

- `onDeviceChange(callback: () => void): () => void` - Listen for device changes

## TypeScript Support

The library is fully typed with TypeScript. Import types as needed:

```tsx
import type {
  MediaDeviceInfo,
  DeviceList,
  SelectedDevices,
  MediaState,
  MediaDeviceHookReturn,
} from "react-meet";
```

## Examples

The library includes example components demonstrating both approaches:

```tsx
import { DeviceListExample, HookExample } from "react-meet";

// Use examples to learn implementation patterns
function App() {
  return (
    <div>
      <HookExample />
      <DeviceListExample />
    </div>
  );
}
```

## Browser Support

This library requires modern browsers with support for:

- `navigator.mediaDevices.getUserMedia()`
- `navigator.mediaDevices.enumerateDevices()`
- `HTMLAudioElement.setSinkId()` (for speaker selection)

## License

MIT License - see LICENSE file for details.
