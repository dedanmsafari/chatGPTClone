import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";

const Settings = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: "Chat",
        }}
      />
    </View>
  );
};

export default Settings;
