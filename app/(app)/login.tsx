import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useSession } from "@/context/authContext";

const login = () => {
  const { type = "login" } = useLocalSearchParams<{ type: string }>();

  const { pendingVerification, register, signIn, verify, loading } =
    useSession();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassWord] = useState("");
  const [code, setCode] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={70}
      style={styles.container}
    >
      <Image
        source={require("../../assets/images/logo-dark.png")}
        style={styles.logo}
      />

      <Text style={[styles.title]}>
        {type === "login" ? "Welcome Back" : "Create your account"}
      </Text>

      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {!pendingVerification && (
        <View style={{ marginBottom: 30 }}>
          <TextInput
            autoCapitalize="none"
            placeholder="john@mail.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassWord}
            style={styles.inputField}
            secureTextEntry
          />
        </View>
      )}

      {type === "login" && !pendingVerification ? (
        <TouchableOpacity
          style={[defaultStyles.btn, styles.btnPrimary]}
          onPress={async () => {
            const result = await signIn(emailAddress, password);
            if (result) {
              router.replace("/(root)/(drawer)");
            }
          }}
        >
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : null}

      {type === "register" && !pendingVerification ? (
        <TouchableOpacity
          style={[defaultStyles.btn, styles.btnPrimary]}
          onPress={() => register(emailAddress, password)}
        >
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      ) : null}

      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={setCode}
              style={styles.inputField}
            />
          </View>
          <TouchableOpacity
            style={[defaultStyles.btn, styles.btnPrimary]}
            onPress={async () => {
              const result = await verify(code);
              if (result) {
                router.replace("/(root)/(drawer)");
              }
            }}
          >
            <Text style={styles.btnPrimaryText}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginTop: 80,
    marginBottom: 50,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "PlaywritePL-Regular",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
