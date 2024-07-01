import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import * as ContextMenu from "zeego/context-menu";

import { Message, Role } from "@/utils/types";
import Colors from "@/constants/Colors";
import {
  copyImageToClipboard,
  downloadAndSaveImage,
  shareImage,
} from "@/utils/Image";

const ChatMessage = ({
  role,
  content,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
  const contextItems = [
    {
      title: "Copy",
      systemIcon: "doc.on.doc",
      action: () => copyImageToClipboard(imageUrl!),
    },
    {
      title: "Save to Photos",
      systemIcon: "arrow.down.to.line",
      action: () => downloadAndSaveImage(imageUrl!),
    },
    {
      title: "Share",
      systemIcon: "square.and.arrow.up",
      action: () => shareImage(imageUrl!),
    },
  ];

  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={styles.ImageContainer}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={styles.BotImage}
          />
        </View>
      ) : (
        <Image
          source={require("@/assets/images/man.jpg")}
          style={styles.UserImage}
        />
      )}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} size="small" />
        </View>
      ) : (
        <>
          {content === "" && imageUrl ? (
            <ContextMenu.Root>
              <ContextMenu.Trigger action="press">
                <Pressable>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                  />
                </Pressable>
              </ContextMenu.Trigger>
              <ContextMenu.Content
                loop={false}
                alignOffset={10}
                avoidCollisions={true}
                collisionPadding={20}
              >
                {contextItems.map((item) => (
                  <ContextMenu.Item key={item.title} onSelect={item.action}>
                    <ContextMenu.ItemTitle>{item.title}</ContextMenu.ItemTitle>
                    <ContextMenu.ItemIcon
                      ios={{
                        name: item.systemIcon,
                        pointSize: 18,
                      }}
                    />
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          ) : (
            <Text style={styles.text}>{content}</Text>
          )}
        </>
      )}
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  ImageContainer: {
    backgroundColor: "#000",
    overflow: "hidden",
    borderRadius: 15,
  },
  BotImage: {
    height: 16,
    width: 16,
    margin: 6,
  },
  UserImage: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  text: {
    padding: 4,
    flexWrap: "wrap",
    fontSize: 16,
    flex: 1,
  },
  loading: {
    justifyContent: "center",
    height: 26,
    marginLeft: 14,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
});
