import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
  SpeakerIcon,
  MicIcon,
  VideoIcon,
  ChevronDownIcon,
  CheckIcon,
  FlipHorizontalIcon,
  RotateCwIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { CameraSettings } from "../types";
import SlideTabs from "./SlideTabs";
import SliderToggle from "./SlideToggle";

interface Device {
  deviceId: string;
  label: string;
}

interface Devices {
  cameras: Device[];
  microphones: Device[];
  speakers: Device[];
}

interface SelectedDevices {
  camera: string;
  microphone: string;
  speaker: string;
}

interface WebcamSettingsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  devices: Devices;
  selectedDevices: SelectedDevices;
  onDeviceChange: (
    deviceId: string,
    deviceType: "camera" | "microphone" | "speaker"
  ) => void;
  cameraSettings: CameraSettings;
  onCameraSettingsChange: (settings: CameraSettings) => void;
}

const WebcamSettings = ({
  isOpen,
  onOpenChange,
  devices,
  selectedDevices,
  onDeviceChange,
  cameraSettings,
  onCameraSettingsChange,
}: WebcamSettingsProps) => {
  const [activeTab, setActiveTab] = useState<string>("audio");

  const getDeviceList = (deviceType: "microphone" | "camera" | "speaker") => {
    switch (deviceType) {
      case "microphone":
        return devices.microphones;
      case "camera":
        return devices.cameras;
      case "speaker":
        return devices.speakers;
    }
  };

  const getDeviceLabel = (device: Device, deviceType: string) => {
    if (device.label) return device.label;
    return `${deviceType} ${device.deviceId.slice(0, 8)}...`;
  };

  const renderDeviceSelect = (
    deviceType: "microphone" | "camera" | "speaker",
    IconComponent: React.ComponentType<{ size?: number | string }>,
    label: string
  ) => {
    const deviceList = getDeviceList(deviceType);
    const selectedDevice = selectedDevices[deviceType as keyof SelectedDevices];

    return (
      <div className="space-y-2">
        <label className="text-dark text-sm font-medium flex items-center gap-2">
          <IconComponent size={16} />
          {label}
        </label>
        <Select.Root
          value={selectedDevice}
          onValueChange={(value) => onDeviceChange(value, deviceType)}
        >
          <Select.Trigger className="w-full bg-dark text-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3f8ae0] flex items-center justify-between">
            <Select.Value
              placeholder={
                deviceList && deviceList.length > 0
                  ? "Select a device"
                  : "No device found"
              }
            />
            <Select.Icon>
              <ChevronDownIcon size={16} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-dark text-light rounded shadow-lg border border-dark-gray min-w-[200px] z-50">
              <Select.Viewport className="p-1">
                {deviceList && deviceList.length > 0 ? (
                  deviceList.map((device) => (
                    <Select.Item
                      key={device.deviceId}
                      value={device.deviceId}
                      className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                    >
                      <Select.ItemText>
                        {getDeviceLabel(device, label)}
                      </Select.ItemText>
                      <Select.ItemIndicator className="absolute right-2">
                        <CheckIcon size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-400">
                    No {label.toLowerCase()} devices found
                  </div>
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-light rounded-2xl mx-4 p-4 w-fit max-h-[80vh] h-1/2 overflow-y-auto flex flex-col gap-4">
          <div className="sticky top-0 bg-light flex justify-between items-center gap-4">
            <Dialog.Title className="text-dark text-lg font-medium">
              <SlideTabs setActiveTab={setActiveTab} />
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-full bg-light hover:bg-light-hover text-dark cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <XIcon />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="p-4 flex flex-1 flex-col gap-4 overflow-y-auto">
              {activeTab === "audio" && (
                <div className="space-y-4">
                  {renderDeviceSelect("microphone", MicIcon, "Microphone")}
                  {renderDeviceSelect("speaker", SpeakerIcon, "Speaker")}
                </div>
              )}
              {activeTab === "camera" && (
                <div className="space-y-4">
                  {renderDeviceSelect("camera", VideoIcon, "Camera")}

                  <div className="space-y-4">
                    <h3 className="text-dark text-sm font-medium">
                      Camera Settings
                    </h3>

                    {devices.cameras.length === 0 ? (
                      <div className="text-gray-400 text-sm">
                        No camera devices available
                      </div>
                    ) : (
                      <>
                        {/* Flip Option */}
                        <div className="space-y-2">
                          <label className="text-dark text-sm font-medium flex items-center gap-2">
                            <FlipHorizontalIcon size={16} />
                            Flip Camera
                          </label>
                          <div className="flex items-center gap-2">
                            <SliderToggle
                              selected={cameraSettings.flip}
                              toggleOn={() =>
                                onCameraSettingsChange({
                                  ...cameraSettings,
                                  flip: true,
                                })
                              }
                              toggleOff={() =>
                                onCameraSettingsChange({
                                  ...cameraSettings,
                                  flip: false,
                                })
                              }
                              offLabel="Off"
                              onLabel="On"
                            />
                          </div>
                        </div>

                        {/* Rotation Option */}
                        <div className="space-y-2">
                          <label className="text-dark text-sm font-medium flex items-center gap-2">
                            <RotateCwIcon size={16} />
                            Rotate Camera
                          </label>
                          <Select.Root
                            value={
                              cameraSettings.rotate
                                ? cameraSettings.rotate.toString()
                                : "false"
                            }
                            onValueChange={(value) =>
                              onCameraSettingsChange({
                                ...cameraSettings,
                                rotate:
                                  value === "false"
                                    ? false
                                    : (parseInt(value) as 90 | 180 | 270),
                              })
                            }
                          >
                            <Select.Trigger className="w-full bg-dark text-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3f8ae0] flex items-center justify-between">
                              <Select.Value placeholder="Select rotation" />
                              <Select.Icon>
                                <ChevronDownIcon size={16} />
                              </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-dark text-light rounded shadow-lg border border-dark-gray min-w-[200px] z-50">
                                <Select.Viewport className="p-1">
                                  <Select.Item
                                    value="false"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>
                                      No Rotation
                                    </Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                  <Select.Item
                                    value="90"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>90°</Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                  <Select.Item
                                    value="180"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>180°</Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                  <Select.Item
                                    value="270"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>270°</Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>

                        {/* Aspect Ratio Option */}
                        <div className="space-y-2">
                          <label className="text-dark text-sm font-medium flex items-center gap-2">
                            <SquareIcon size={16} />
                            Aspect Ratio
                          </label>
                          <Select.Root
                            value={
                              cameraSettings.ratio
                                ? cameraSettings.ratio
                                : "false"
                            }
                            onValueChange={(value) =>
                              onCameraSettingsChange({
                                ...cameraSettings,
                                ratio:
                                  value === "false"
                                    ? false
                                    : (value as "video" | "square"),
                              })
                            }
                          >
                            <Select.Trigger className="w-full bg-dark text-light rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3f8ae0] flex items-center justify-between">
                              <Select.Value placeholder="Select aspect ratio" />
                              <Select.Icon>
                                <ChevronDownIcon size={16} />
                              </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Content className="bg-dark text-light rounded shadow-lg border border-dark-gray min-w-[200px] z-50">
                                <Select.Viewport className="p-1">
                                  <Select.Item
                                    value="false"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>Default</Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                  <Select.Item
                                    value="video"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>
                                      16:9 (Video)
                                    </Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                  <Select.Item
                                    value="square"
                                    className="relative flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-dark-gray focus:bg-dark-gray focus:outline-none"
                                  >
                                    <Select.ItemText>
                                      1:1 (Square)
                                    </Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2">
                                      <CheckIcon size={16} />
                                    </Select.ItemIndicator>
                                  </Select.Item>
                                </Select.Viewport>
                              </Select.Content>
                            </Select.Portal>
                          </Select.Root>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "other" && (
                <div className="space-y-4">Other Settings</div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WebcamSettings;
