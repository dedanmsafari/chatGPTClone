import {
  View,
  Image,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Stack, useNavigation } from "expo-router";

import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";

const DUMMY_MESSAGES: Message[] = [
  {
    content: "Hello, how can i help you today?",
    role: Role.Bot,
  },
  {
    content:
      "I need help with my React Native app.I need help with my React Native app.I need help with my React Native app.I need help with my React Native app.I need help with my React Native app.I need help with my React Native app.I need help with my React Native app.",
    role: Role.User,
  },
];

const Page = () => {
  const [gptVersion, setGptVersion] = useState("3.5");
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [height, setHeight] = useState(0);

  const getCompletion = (message: string) => {
    console.log("Completion message :", message);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;

    setHeight(height);
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
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.Image}
            />
          </View>
        )}

        <FlashList
          data={DUMMY_MESSAGES}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
        />
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
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessageInput onShouldSendMessage={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  Image: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
});
