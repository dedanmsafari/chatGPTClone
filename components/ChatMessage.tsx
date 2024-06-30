import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React from "react";
import { Message, Role } from "@/utils/types";
import Colors from "@/constants/Colors";

const ChatMessage = ({
  role,
  content,
  imageUrl,
  prompt,
  loading,
}: Message & { loading?: boolean }) => {
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
            <>
              <Pressable>
                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              </Pressable>
            </>
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
