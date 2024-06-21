import React from "react";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const _layout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="(chat)"
        options={{
          drawerLabel: "ChatGPT",
          drawerLabelStyle: { fontFamily: "PlaywritePL-Regular" },
          headerTitleAlign: "center",
          title: "ChatGPT",
          headerTitleStyle: {
            fontFamily: Platform.select({
              android: "Ubuntu_500Medium",
              ios: "Ubuntu-Medium",
            }),
          },
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "#000" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.Image}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(root)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
};

export default _layout;

const styles = StyleSheet.create({
  Image: {
    width: 16,
    height: 16,
    margin: 6,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
  },
});
