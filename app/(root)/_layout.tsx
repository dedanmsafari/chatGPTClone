import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";

import { useSession } from "@/context/authContext";
import { Redirect, Stack, router } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const AppLayout = () => {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/settings"
        options={{
          presentation: "modal",
          headerTitle: "Settings",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.selected },
          headerRight: () =>
            router.canGoBack() && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  backgroundColor: Colors.greyLight,
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <Ionicons name="close-outline" size={16} color={Colors.grey} />
              </TouchableOpacity>
            ),
        }}
      />
    </Stack>
  );
};

export default AppLayout;
