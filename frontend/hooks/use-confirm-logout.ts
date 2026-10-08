import { useCallback } from "react";
import { Alert, Platform } from "react-native";

import { useAuth } from "@/contexts/auth-context";

/** Returns a handler that asks for confirmation, then logs the user out. */
export function useConfirmLogout(onBeforeLogout?: () => void) {
  const { logout } = useAuth();

  return useCallback(() => {
    const doLogout = () => {
      onBeforeLogout?.();
      logout();
    };
    // Alert buttons aren't supported on web, so log out directly there.
    if (Platform.OS === "web") {
      doLogout();
      return;
    }
    Alert.alert("Log out?", "You will need a new email code to sign back in.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: doLogout },
    ]);
  }, [logout, onBeforeLogout]);
}
