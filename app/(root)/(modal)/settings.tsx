import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/mmkvStorage";
import { TextInput } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { router } from "expo-router";
import { useSession } from "@/context/authContext";

const Settings = () => {
  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);

  const [apiKey, setApiKey] = useState("");
  const [org, setOrg] = useState("");

  const { signOut } = useSession();

  const disabled = !apiKey || !org || apiKey === "" || org === "";

  const saveApiKey = () => {
    setKey(apiKey);
    setOrganization(org);
    setApiKey("");
    setOrg("");
    router.navigate("/(root)/(drawer)/(chat)/new");
  };

  const removeApiKey = () => {
    setKey("");
    setOrganization("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatGPT API Key Configuration</Text>
      {key && key !== "" && (
        <>
          <Text style={styles.label}>You are all Set!</Text>
          <TouchableOpacity
            onPress={removeApiKey}
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
          >
            <Text style={styles.buttonText}>Remove API Key</Text>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              marginVertical: 40,
              borderColor: Colors.greyLight,
            }}
          />
          <TouchableOpacity
            onPress={() => signOut()}
            style={[defaultStyles.btn, { backgroundColor: "tomato" }]}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}

      {(!key || key === "") && (
        <>
          <TextInput
            placeholder="Enter your API key"
            onChangeText={setApiKey}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
            value={apiKey}
          />
          <TextInput
            placeholder="Your Organization"
            onChangeText={setOrg}
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
            value={org}
          />
          <TouchableOpacity
            onPress={saveApiKey}
            style={[
              defaultStyles.btn,
              { backgroundColor: disabled ? Colors.greyLight : Colors.primary },
            ]}
            disabled={!apiKey || !org || apiKey === "" || org === ""}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              marginVertical: 40,
              borderColor: Colors.greyLight,
            }}
          />
          <TouchableOpacity
            onPress={() => signOut()}
            style={[defaultStyles.btn, { backgroundColor: "tomato" }]}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    textAlign: "center",
    paddingBottom: 30,
    fontSize: 16,
    fontFamily: Platform.select({
      android: "Ubuntu_500Medium",
      ios: "Ubuntu-Medium",
    }),
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});
