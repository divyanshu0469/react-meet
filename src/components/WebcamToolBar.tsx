import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import WebcamButton from "./WebcamButton";
import {
  HandIcon,
  MoreVerticalIcon,
  ScreenShareIcon,
  ScreenShareOffIcon,
  SettingsIcon,
  Users2Icon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

const MorePopover = ({
  isMobile,
  toggleSettings,
  toggleShareScreen,
  toggleRaiseHand,
  shareScreenOn,
  raiseHandOn,
  toggleSideContainer,
}: {
  isMobile: boolean;
  toggleSettings: () => void;
  toggleShareScreen: () => void;
  toggleRaiseHand: () => void;
  shareScreenOn: boolean;
  raiseHandOn: boolean;
  toggleSideContainer: () => void;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <WebcamButton icon tooltip="More">
          <MoreVerticalIcon />
        </WebcamButton>
      </Popover.Trigger>
      <Popover.Content className="z-30 p-2 m-2 bg-dark rounded-lg flex flex-col gap-2 font-light">
        <WebcamButton onClick={toggleSideContainer}>
          <Users2Icon size={16} />
          <span className="flex flex-1">Participants</span>
        </WebcamButton>

        {isMobile && (
          <>
            <WebcamButton
              onClick={toggleShareScreen}
              isActive={shareScreenOn}
              variant="default"
            >
              {shareScreenOn ? (
                <ScreenShareIcon size={16} />
              ) : (
                <ScreenShareOffIcon size={16} />
              )}
              <span className="flex flex-1">Share Screen</span>
            </WebcamButton>
            <WebcamButton
              onClick={toggleRaiseHand}
              isActive={raiseHandOn}
              variant="default"
            >
              <HandIcon size={16} />
              <span className="flex flex-1">Raise Hand</span>
            </WebcamButton>
            <WebcamButton onClick={toggleSettings}>
              <SettingsIcon size={16} />
              <span className="flex flex-1">Settings</span>
            </WebcamButton>
          </>
        )}
      </Popover.Content>
    </Popover.Root>
  );
};

interface WebcamToolBarProps {
  toggleMicrophone: () => void;
  microphoneOn: boolean;
  toggleCamera: () => void;
  cameraOn: boolean;
  toggleShareScreen: () => void;
  shareScreenOn: boolean;
  toggleRaiseHand: () => void;
  raiseHandOn: boolean;
  toggleSettings: () => void;
  toggleSideContainer: () => void;
}

const WebcamToolBar = ({
  toggleMicrophone,
  microphoneOn,
  toggleCamera,
  cameraOn,
  toggleShareScreen,
  shareScreenOn,
  toggleRaiseHand,
  raiseHandOn,
  toggleSettings,
  toggleSideContainer,
}: WebcamToolBarProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 558px)" });
  return (
    <div className="flex justify-center items-center">
      <Tooltip.Provider>
        <div className="flex items-center gap-2">
          <WebcamButton
            onClick={toggleMicrophone}
            isActive={microphoneOn}
            variant="destructive"
            icon
            tooltip={microphoneOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {microphoneOn ? <MicIcon /> : <MicOffIcon />}
          </WebcamButton>
          <WebcamButton
            onClick={toggleCamera}
            isActive={cameraOn}
            variant="destructive"
            icon
            tooltip={cameraOn ? "Stop Camera" : "Start Camera"}
          >
            {cameraOn ? <VideoIcon /> : <VideoOffIcon />}
          </WebcamButton>
          {!isMobile && (
            <>
              <WebcamButton
                onClick={toggleShareScreen}
                isActive={shareScreenOn}
                variant="default"
                icon
                tooltip={
                  shareScreenOn ? "Stop Sharing Screen" : "Start Sharing Screen"
                }
              >
                {shareScreenOn ? <ScreenShareIcon /> : <ScreenShareOffIcon />}
              </WebcamButton>
              <WebcamButton
                onClick={toggleRaiseHand}
                isActive={raiseHandOn}
                variant="default"
                icon
                tooltip={raiseHandOn ? "Lower Hand" : "Raise Hand"}
              >
                <HandIcon />
              </WebcamButton>
            </>
          )}

          <WebcamButton onClick={toggleSideContainer} icon tooltip="Chat">
            <MessageCircleIcon />
          </WebcamButton>
          {!isMobile && (
            <WebcamButton onClick={toggleSettings} icon tooltip="Settings">
              <SettingsIcon />
            </WebcamButton>
          )}
          <MorePopover
            isMobile={isMobile}
            toggleSettings={toggleSettings}
            toggleShareScreen={toggleShareScreen}
            toggleRaiseHand={toggleRaiseHand}
            shareScreenOn={shareScreenOn}
            raiseHandOn={raiseHandOn}
            toggleSideContainer={toggleSideContainer}
          />
          <WebcamButton
            isActive={false}
            variant="destructive"
            icon
            tooltip="End Call"
          >
            <PhoneIcon className="transform rotate-135" />
          </WebcamButton>
        </div>
      </Tooltip.Provider>
    </div>
  );
};

WebcamToolBar.displayName = "WebcamButton";

export default WebcamToolBar;
