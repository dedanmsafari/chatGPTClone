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
import React, { useEffect, useState, useMemo } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack, useNavigation } from "expo-router";

import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/types";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/components/ChatMessage";

import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/mmkvStorage";

import OpenAI from "react-native-openai";
import Colors from "@/constants/Colors";

const dummyMessages = [
  {
    role: Role.Bot,
    content: "",
    imageUrl: "https://galaxies.dev/img/meerkat_2.jpg",
    prompt:
      "A meerkat astronaut in a futuristic spacesuit, standing upright on a rocky, alien landscape resembling the surface of Mars. The spacesuit is highly detailed with reflective visor and intricate life-support systems. The background shows a distant starry sky and a small Earth visible in the far horizon. The meerkat looks curious and brave, embodying the spirit of exploration.",
  },
];

const Page = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [height, setHeight] = useState(0);

  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);
  const [working, setWorking] = useState(false);

  const openAI = useMemo(
    () =>
      // @ts-ignore
      new OpenAI({
        apiKey: key,
        organization,
      }),
    []
  );

  const getCompletion = async (message: string) => {
    setWorking(true);

    setMessages([...messages, { role: Role.User, content: message }]);

    //send a message.
    const result = await openAI.image.create({
      prompt: message,
      n: 3,
    });

    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: "", imageUrl, prompt: message },
      ]);
    }

    setWorking(false);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;

    setHeight(height);
  };

  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href="/(root)/(modal)/settings" />;
  }

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
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <>
            <View
              style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}
            >
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.Image}
              />
            </View>
            <Text style={styles.logoText}>
              Go Wild with your Image generation
            </Text>
          </>
        )}

        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{
            paddingTop: 30,
            paddingBottom: 150,
          }}
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            <>
              {working && (
                <ChatMessage
                  {...{ role: Role.Bot, content: "", loading: true }}
                />
              )}
            </>
          }
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
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 50,
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  Image: {
    resizeMode: "cover",
  },
  logoText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    color: Colors.grey,
    fontFamily: Platform.select({
      android: "Ubuntu_400Regular",
      ios: "Ubuntu-Regular",
    }),
  },
});
