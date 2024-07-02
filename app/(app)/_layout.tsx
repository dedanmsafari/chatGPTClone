import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack, router } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import { useSession } from "@/context/authContext";
import { defaultStyles } from "@/constants/Styles";

export { ErrorBoundary } from "@/utils/errorBoundary";

export default function InitialLayout() {
  const { session, isLoading, setPendingVerification } = useSession();
  if (session) {
    return <Redirect href="/(root)/(drawer)/dalle" />;
  }

  if (isLoading) {
    return (
      <View style={defaultStyles.loadingOverlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="login"
        options={{
          title: "",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                setPendingVerification(false);
                router.replace("/");
              }}
            >
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
