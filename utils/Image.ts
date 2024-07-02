import { Alert } from "react-native";

import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";

export async function downloadAndSaveImage(imageUrl: string) {
  let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    return saveFile(res.uri);
  } catch (err) {
    console.log("File System error:", err);
  }
}

async function saveFile(fileUri: string) {
  const { status } = await MediaLibrary.requestPermissionsAsync();

  if (status === "granted") {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync("Download");

      if (album == null) {
        const result = await MediaLibrary.createAlbumAsync(
          "Download",
          asset,
          false
        );
        if (result) {
          Alert.alert("Image saved to Photos");
        }
      } else {
        const result = await MediaLibrary.addAssetsToAlbumAsync(
          [asset],
          album,
          false
        );
        if (result) {
          Alert.alert("Image saved to Photos");
        }
      }
    } catch (err) {
      console.log("Save err: ", err);
    }
  } else if (status === "denied") {
    Alert.alert("Please allow permissions to download");
  }
}

export async function copyImageToClipboard(imageUrl: string) {
  let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    const base64 = await FileSystem.readAsStringAsync(res.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await Clipboard.setImageAsync(base64);
  } catch (err) {
    console.log("File System error", err);
  }
}

export async function shareImage(imageUrl: string) {
  let fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;
  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);

    return Sharing.shareAsync(res.uri);
  } catch (err) {
    console.log("Error Sharing Image:", err);
  }
}
