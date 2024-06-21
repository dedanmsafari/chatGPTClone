import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

import { useSession } from "@/context/authContext";
import { Redirect, Stack } from "expo-router";

const AppLayout = () => {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(modal)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
