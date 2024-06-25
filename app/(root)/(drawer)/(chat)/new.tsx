import {
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack, useNavigation } from "expo-router";
import { useSession } from "@/context/authContext";
import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";

const Page = () => {
  const { signOut } = useSession();
  const [gptVersion, setGptVersion] = useState("3.5");

  const getCompletion = (message: string) => {
    console.log("Completion message :", message);
  };

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
      <View style={{ flex: 1 }}>
        <Text>Home </Text>

        <Button title="Sign Out" onPress={signOut} />
        {/* <ScrollView>
          {Array.from({ length: 100 }).map((_, index) => (
            <Text key={index}>{index}njkkjnjknjknjklnk</Text>
          ))}
        </ScrollView> */}
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;
