import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Keyboard,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { TextInput } from "react-native-gesture-handler";

export const CustomDrawerContent = (props: any) => {
  const insets = useSafeAreaInsets();

  const isDrawerOpen = useDrawerStatus() === "open";

  useEffect(() => {
    if (isDrawerOpen) {
      console.log("open");
    }
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  return (
    <View style={{ flex: 1, marginTop: insets.top }}>
      <View
        style={{
          backgroundColor: "white",
          paddingBottom: 16,
        }}
      >
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.greyLight}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            underlineColorAndroid={"transparent"}
            cursorColor={Colors.greyLight}
          />
        </View>
      </View>

      <DrawerContentScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        {...props}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ padding: 16, paddingBottom: insets.bottom + 10 }}>
        <Link href="/(root)/(modal)/settings" asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={require("@/assets/images/robot.jpg")}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Albon Mechatron</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const _layout = () => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: Colors.light },
        headerTitleStyle: {
          fontFamily: Platform.select({
            android: "Ubuntu_500Medium",
            ios: "Ubuntu-Medium",
          }),
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        drawerActiveBackgroundColor: Colors.selected,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        overlayColor: "rgba(0,0,0,0.2)",
        drawerItemStyle: { borderRadius: 12 },
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: "PlaywritePL-Regular",
        },
        drawerStyle: { width: dimensions.width * 0.86 },
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        getId={() => Math.random().toString()}
        options={{
          drawerLabel: "ChatGPT",
          title: "ChatGPT",
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
      <Drawer.Screen
        name="dalle"
        options={{
          drawerLabel: "DALL · E",

          title: "Generate Images",

          drawerIcon: () => (
            <View style={styles.item}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.dalleImage}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        getId={() => String(Date.now())}
        options={{
          drawerLabel: "Explore GPT'S",

          title: "Specific GPT'S",

          drawerIcon: () => (
            <View style={[styles.item]}>
              <Ionicons
                name="apps"
                size={18}
                color={"#000"}
                style={{ margin: 6 }}
              />
            </View>
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
  dalleImage: {
    width: 28,
    height: 28,
    resizeMode: "cover",
  },
  searchSection: {
    flexDirection: "row",
    marginHorizontal: 12,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
  },
  searchIcon: {
    padding: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 0,
    alignItems: "center",
    color: "#424242",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "PlaywritePL-Regular",
  },
});
