import React, { useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import from Expo

type AvatarProps = {
  initialAvatarUrl: string;
  size?: number;
};

export default function Avatar({ initialAvatarUrl, size = 100 }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  // Function to handle avatar change
  const handleAvatarChange = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photo library to change the avatar.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allow cropping
      aspect: [1, 1], // Square aspect ratio
      quality: 1, // High quality
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri); // Update the avatar URL with the selected image
    }
  };

  return (
    <TouchableOpacity onPress={handleAvatarChange}>
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image
          source={{ uri: avatarUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
