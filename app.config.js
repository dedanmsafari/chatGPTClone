module.exports = {
  name: "chatGPTClone",
  slug: "chatGPTClone",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.dedanmsafari.chatGPTClone",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/SpaceMono-Regular.ttf",
          "./assets/fonts/PlaywritePL-ExtraLight.ttf",
          "./assets/fonts/PlaywritePL-Light.ttf",
          "./assets/fonts/PlaywritePL-Regular.ttf",
          "./assets/fonts/PlaywritePL-Thin.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_300Light.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_300Light_Italic.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_400Regular.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_400Regular_Italic.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_500Medium.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_500Medium_Italic.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_700Bold.ttf",
          "node_modules/@expo-google-fonts/ubuntu/Ubuntu_700Bold_Italic.ttf",
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
};
