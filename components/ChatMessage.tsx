import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Message, Role } from "@/utils/types";

const ChatMessage = ({ role, content, imageUrl, prompt }: Message) => {
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
      <Text style={styles.text}>{content}</Text>
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
    borderRadius: 20,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  BotImage: {
    height: 20,
    width: 20,
    borderRadius: 15,
    backgroundColor: "#000",
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
});
