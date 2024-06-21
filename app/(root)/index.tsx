import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSession } from "@/context/authContext";
import { defaultStyles } from "@/constants/Styles";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const index = () => {
  const { signOut } = useSession();

  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <Text>I am Inside the app</Text>

      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnPrimary]}
        onPress={signOut}
      >
        <Text style={styles.btnPrimaryText}>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[defaultStyles.btn, styles.btnPrimary]}
        onPress={() => router.navigate("/settings")}
      >
        <Text style={styles.btnPrimaryText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
