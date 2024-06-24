import { View, Text, Button, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack, useNavigation } from "expo-router";
import { useSession } from "@/context/authContext";
import HeaderDropDown from "@/components/HeaderDropDown";

const Page = () => {
  const { signOut } = useSession();
  const [gptVersion, setGptVersion] = useState("3.5");

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ChatGPT"
              selected={gptVersion}
              onSelect={(key) => {
                console.warn(key);
                setGptVersion(key);
              }}
              items={[
                { key: "3.5", title: "GPT-3.5", icon: "bolt" },
                { key: "4", title: "GPT-4", icon: "sparkles" },
              ]}
            />
          ),
        }}
      />
      <Text>Home </Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default Page;
