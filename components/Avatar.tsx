import React, { useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import from Expo

import BronzeBadge from "@/assets/badges/badge_bronze.png";
import SilverBadge from "@/assets/badges/badge_silver.png";
import GoldBadge from "@/assets/badges/badge_silver.png";

type AvatarProps = {
  initialAvatarUrl: string;
  size?: number;
  score: number;
};

export default function Avatar({ initialAvatarUrl, size = 100, score }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const getBadge = () => {
    if (score >= 100) return GoldBadge;
    if (score >= 50) return SilverBadge;
    return BronzeBadge; // Default badge
  };

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
    <TouchableOpacity onPress={handleAvatarChange} style={styles.avatarWrapper}>
      {/* Avatar Image */}
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image source={{ uri: avatarUrl }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      </View>

      {/* Badge Overlay (Outside Avatar) */}
      <View style={[styles.badgeContainer, { width: size * 0.35, height: size * 0.35 }]}>
        <Image source={getBadge()} style={styles.badgeImage} />
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
  badgeContainer: {
    position: "absolute",
    bottom: "-12%", // Moves badge slightly outside the avatar
    right: "-2%", // Moves badge to the outside right
    padding: 3, // Adds space around the badge
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  badgeImage: {
    width: "150%",
    height: "170%",
    resizeMode: "contain",
  },
});
