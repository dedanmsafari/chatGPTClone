import { useState } from "react";
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
import React from "react";
import { useLocalSearchParams, router } from "expo-router";

import { useSignUp, useSignIn } from "@clerk/clerk-expo";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const login = () => {
  const { type } = useLocalSearchParams<{ type: string }>();

  const onSignUp = useSignUp();
  const onSignIn = useSignIn();

  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassWord] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    setLoading(true);
    if (!onSignUp.isLoaded) {
      return;
    }

    try {
      await onSignUp.signUp.create({
        emailAddress,
        password,
      });

      await onSignUp.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    setLoading(true);
    if (!onSignUp.isLoaded) {
      return;
    }

    try {
      const completeSignUp =
        await onSignUp.signUp.attemptEmailAddressVerification({
          code,
        });

      await onSignUp.setActive({ session: completeSignUp.createdSessionId });
      router.replace("/");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.warn(JSON.stringify(err, null, 2));
    }
  };

  const onSignInPress = async () => {
    setLoading(true);
    if (!onSignIn.isLoaded) {
      return;
    }

    try {
      const completeSignIn = await onSignIn.signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await onSignIn.setActive({ session: completeSignIn.createdSessionId });
      setLoading(false);
      console.warn("Signed In");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={70}
      style={styles.container}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Image
        source={require("../assets/images/logo-dark.png")}
        style={styles.logo}
      />

      <Text style={[styles.title]}>
        {type === "login" ? "Welcome Back" : "Create your account"}
      </Text>

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
          onPress={onSignInPress}
        >
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : null}

      {type === "register" && !pendingVerification ? (
        <TouchableOpacity
          style={[defaultStyles.btn, styles.btnPrimary]}
          onPress={onSignUpPress}
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
            onPress={onPressVerify}
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
