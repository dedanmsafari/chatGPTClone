import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <TouchableOpacity style={[defaultStyles.btn, styles.btnLight]}>
        <Ionicons name="logo-apple" size={14} style={styles.btnIcon} />
        <Text style={styles.btnLightText}>Continue with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[defaultStyles.btn, styles.btnDark]}>
        <Ionicons
          name="logo-google"
          size={16}
          style={styles.btnIcon}
          color={"#fff"}
        />
        <Text style={styles.btnDarkText}>Continue with Google</Text>
      </TouchableOpacity>

      <Link
        asChild
        href="/login?type=register"
        style={[defaultStyles.btn, styles.btnDark]}
      >
        <TouchableOpacity>
          <Ionicons
            name="mail"
            size={16}
            style={styles.btnIcon}
            color={"#fff"}
          />
          <Text style={styles.btnDarkText}>Sign up with email</Text>
        </TouchableOpacity>
      </Link>
      <Link
        asChild
        href="/login?type=login"
        style={[defaultStyles.btn, styles.btnOutline]}
      >
        <TouchableOpacity>
          <Text style={styles.btnDarkText}>Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default BottomLoginSheet;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 26,
    gap: 14,
  },
  btnLight: {
    backgroundColor: "#fff",
  },
  btnDark: {
    backgroundColor: Colors.grey,
  },
  btnIcon: {
    paddingRight: 6,
  },
  btnLightText: {
    color: "#000",
    fontSize: 20,
  },
  btnDarkText: {
    color: "#fff",
    fontSize: 20,
  },
  btnOutline: {
    borderWidth: 3,
    borderColor: Colors.grey,
  },
});
