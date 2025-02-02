import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import BronzeBadge from "@/assets/badges/badge_bronze.png";
import SilverBadge from "@/assets/badges/badge_silver.png";
import GoldBadge from "@/assets/badges/badge_gold.png"; // Fixed incorrect import

import Bear from "@/assets/profile/8bit_bear.png";
import Cat from "@/assets/profile/8bit_cat.png";
import Chicken from "@/assets/profile/8bit_chicken.png";
import Corgi from "@/assets/profile/8bit_corgi.png";
import Penguin from "@/assets/profile/8bit_penguin.png";
import Rat from "@/assets/profile/8bit_rat.png";

type AvatarProps = {
  initialAvatar: any;
  size?: number;
  score: number;
};

export default function Avatar({
  initialAvatar,
  size = 100,
  score,
}: AvatarProps) {
  const [avatar, setAvatar] = useState(initialAvatar);
  const [modalVisible, setModalVisible] = useState(false);

  const getBadge = () => {
    if (score >= 100) return GoldBadge;
    if (score >= 50) return SilverBadge;
    return BronzeBadge; // Default badge
  };

  const handleAvatarChange = (newAvatar: any) => {
    setAvatar(newAvatar);
    setModalVisible(false);
  };

  return (
    <GestureHandlerRootView style={{ height: 120 }}>
      {/* Profile Image */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={avatar}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      </TouchableOpacity>

      {/* Avatar Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Avatar</Text>
            <View style={styles.avatarContainer}>
              {[Bear, Cat, Chicken, Corgi, Penguin, Rat].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={() => handleAvatarChange(item)}
                >
                  <Image source={item} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Badge */}
      <View
        style={[
          styles.badgeContainer,
          { width: size * 0.35, height: size * 0.35, bottom: size*0.15, right: size*-0.6},
        ]}
      >
        <Image source={getBadge()} style={styles.badgeImage} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#1E1449",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#7F235A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 25,
    fontFamily: "PixelOperator-Bold",
    color: "white",
    marginBottom: 10,
  },
  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatarOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  button: {
    margin: 10,
    alignItems: "center",
  },
  badgeContainer: {
    position: "relative",
    bottom: "5%",
    right: -30,
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
