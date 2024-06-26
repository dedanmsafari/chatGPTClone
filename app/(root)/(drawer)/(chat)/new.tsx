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
import MessageIdeas from "@/components/MessageIdeas";
import { Message } from "@/utils/types";

const Page = () => {
  const { signOut } = useSession();
  const [gptVersion, setGptVersion] = useState("3.5");
  const [message, setMessage] = useState<Message[]>([]);

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
              onSelect={setGptVersion}
              items={[
                { key: "3.5", title: "GPT-3.5", icon: "bolt" },
                { key: "4", title: "GPT-4", icon: "sparkles" },
              ]}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <Button title="Sign Out" onPress={signOut} />
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
        {message.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;
