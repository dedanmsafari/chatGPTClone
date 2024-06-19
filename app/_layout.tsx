import { Ionicons } from "@expo/vector-icons";
import { Stack, router, SplashScreen } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";

import tokenCache from "@/utils/clerkTokenCache";
export { ErrorBoundary } from "@/utils/errorBoundary";

function InitialLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          title: "",
          presentation: "modal",

          headerTitleStyle: { fontFamily: "mon-sb" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

export default function RootLayOut() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
