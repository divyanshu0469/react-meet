import { useCallback, useState } from "react";
import { OptionalState, OptionalHookReturn } from "../types";

/**
 * Custom hook for managing optional meeting features like screenshare,
 * raise hand, chat, and members list visibility states.
 */
export const useOptional = (): OptionalHookReturn => {
  const [optionalState, setOptionalState] = useState<OptionalState>({
    shareScreenOn: false,
    raiseHandOn: false,
    openChat: false,
    openMembersList: false,
  });

  // Toggle functions
  const toggleShareScreen = useCallback(() => {
    setOptionalState((prev) => ({
      ...prev,
      shareScreenOn: !prev.shareScreenOn,
    }));
  }, []);

  const toggleRaiseHand = useCallback(() => {
    setOptionalState((prev) => ({ ...prev, raiseHandOn: !prev.raiseHandOn }));
  }, []);

  const toggleOpenChat = useCallback(() => {
    setOptionalState((prev) => ({ ...prev, openChat: !prev.openChat }));
  }, []);

  const toggleOpenMembersList = useCallback(() => {
    setOptionalState((prev) => ({
      ...prev,
      openMembersList: !prev.openMembersList,
    }));
  }, []);

  // Individual state setters
  const setShareScreen = useCallback((value: boolean) => {
    setOptionalState((prev) => ({ ...prev, shareScreenOn: value }));
  }, []);

  const setRaiseHand = useCallback((value: boolean) => {
    setOptionalState((prev) => ({ ...prev, raiseHandOn: value }));
  }, []);

  const setOpenChat = useCallback((value: boolean) => {
    setOptionalState((prev) => ({ ...prev, openChat: value }));
  }, []);

  const setOpenMembersList = useCallback((value: boolean) => {
    setOptionalState((prev) => ({ ...prev, openMembersList: value }));
  }, []);

  return {
    optionalState,
    toggleShareScreen,
    toggleRaiseHand,
    toggleOpenChat,
    toggleOpenMembersList,
    setShareScreen,
    setRaiseHand,
    setOpenChat,
    setOpenMembersList,
  };
};

export default useOptional;
