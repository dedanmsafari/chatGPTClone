import SessionProvider from "@/context/authContext";
import tokenCache from "@/utils/clerkTokenCache";
import { ClerkProvider } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <SessionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </SessionProvider>
    </ClerkProvider>
  );
}
