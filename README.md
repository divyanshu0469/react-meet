# react-meet

A modern, customizable React webcam library with beautiful UI components and enhanced user experience. Built with TypeScript, Tailwind CSS, and accessibility in mind.

## ✨ Features

- 🚀 **Easy to use** - Simple API with sensible defaults
- 🎨 **Beautiful UI** - Pre-styled components with Tailwind CSS
- 🔧 **Highly customizable** - Override styles and behavior easily
- 📱 **Responsive** - Works on desktop and mobile devices
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🎥 **Advanced features** - Device switching, photo capture, mirroring
- 🛡️ **TypeScript** - Full type definitions included
- 🪝 **React hooks** - Use our hooks in your own components

## 📦 Installation

```bash
npm install react-meet
# or
yarn add react-meet
# or
pnpm add react-meet
```

## 🚀 Quick Start

```tsx
import { Webcam } from "react-meet";
import "react-meet/styles";

function App() {
  return (
    <div className="w-96 h-72">
      <Webcam />
    </div>
  );
}
```

That's it! You now have a fully functional webcam with controls.

## 📖 Examples

### Basic Usage

```tsx
import { Webcam } from "react-meet";

function BasicWebcam() {
  return (
    <Webcam
      className="rounded-lg shadow-lg"
      constraints={{
        width: 1280,
        height: 720,
        facingMode: "user",
      }}
    />
  );
}
```

### Custom Controls

```tsx
import { Webcam, WebcamControls, useWebcam } from "react-meet";

function CustomWebcam() {
  const webcam = useWebcam();

  const handleCapture = () => {
    const photo = webcam.capturePhoto();
    if (photo) {
      console.log("Photo captured:", photo);
    }
  };

  return (
    <div className="relative">
      <Webcam
        ref={webcam.videoRef}
        showControls={false}
        onUserMedia={(stream) => console.log("Stream started:", stream)}
      />

      <WebcamControls
        onCapture={handleCapture}
        onStartStop={() =>
          webcam.isStreaming ? webcam.stopWebcam() : webcam.startWebcam()
        }
        isStreaming={webcam.isStreaming}
        devices={webcam.devices}
      />
    </div>
  );
}
```

### Using Hooks Only

```tsx
import { useWebcam } from "react-meet";

function HookExample() {
  const {
    videoRef,
    startWebcam,
    stopWebcam,
    capturePhoto,
    isStreaming,
    devices,
  } = useWebcam();

  return (
    <div>
      <video
        ref={videoRef}
        className="w-full h-auto rounded-lg"
        autoPlay
        muted
      />

      <div className="mt-4 space-x-2">
        <button
          onClick={() => (isStreaming ? stopWebcam() : startWebcam())}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isStreaming ? "Stop" : "Start"}
        </button>

        <button
          onClick={capturePhoto}
          disabled={!isStreaming}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
```

## 🎛️ API Reference

### `<Webcam>` Component

| Prop               | Type                            | Default | Description                   |
| ------------------ | ------------------------------- | ------- | ----------------------------- |
| `className`        | `string`                        | `''`    | Additional CSS classes        |
| `constraints`      | `WebcamConstraints`             | `{}`    | MediaStream constraints       |
| `onUserMedia`      | `(stream: MediaStream) => void` | -       | Callback when stream starts   |
| `onUserMediaError` | `(error: Error) => void`        | -       | Callback when stream fails    |
| `autoPlay`         | `boolean`                       | `true`  | Auto-start the webcam         |
| `muted`            | `boolean`                       | `true`  | Mute the video element        |
| `mirrored`         | `boolean`                       | `true`  | Mirror the video horizontally |
| `showControls`     | `boolean`                       | `true`  | Show built-in controls        |
| `showOverlay`      | `boolean`                       | `false` | Show custom overlay           |

### `useWebcam` Hook

```tsx
const {
  // State
  isStreaming,
  isLoading,
  error,
  devices,
  currentDevice,
  isMirrored,

  // Methods
  startWebcam,
  stopWebcam,
  capturePhoto,
  toggleMirror,
  switchDevice,

  // Refs
  videoRef,
} = useWebcam(constraints);
```

## 🎨 Styling

react-meet uses Tailwind CSS internally but provides CSS custom properties for easy theming:

```css
:root {
  --react-meet-primary: #3b82f6;
  --react-meet-secondary: #64748b;
  --react-meet-success: #22c55e;
  --react-meet-error: #ef4444;
}
```

You can also override the default classes:

```css
.react-meet-container {
  /* Your custom styles */
}

.react-meet-controls {
  /* Your custom control styles */
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Divyanshu](LICENSE)

## 🚀 Roadmap

- [ ] Video recording functionality
- [ ] Face detection integration
- [ ] Virtual backgrounds
- [ ] Screen sharing support
- [ ] Audio controls
- [ ] WebRTC integration

## 💖 Support

If you found this library helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code

---

Made with ❤️ for the React community
