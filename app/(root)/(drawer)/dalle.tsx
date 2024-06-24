import { View, Text } from "react-native";
import React from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";

const dalle = () => {
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Dall . E &gt;"
              onSelect={() => {}}
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "Bolt",
                },
                { key: "details", title: "See Details", icon: "Search" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
            />
          ),
        }}
      />
      <Text>dalle</Text>
    </View>
  );
};

export default dalle;
