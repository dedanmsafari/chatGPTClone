import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

import { useSession } from "@/context/authContext";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";

const AppLayout = () => {
  const { session, isLoading } = useSession();

  // if (isLoading) {
  //   return (
  //     <View style={defaultStyles.loadingOverlay}>
  //       <ActivityIndicator size="large" color="#fff" />
  //     </View>
  //   );
  // }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
