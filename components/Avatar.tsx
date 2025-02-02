import React, { useState } from "react";
import { Image, StyleSheet, View, TouchableOpacity, Alert, Modal, Text } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import from Expo
import { FlatList, GestureHandlerRootView} from "react-native-gesture-handler";


type AvatarProps = {
  initialAvatarUrl: string;
  size?: number;
};


export default function Avatar({ initialAvatarUrl, size = 100 }: AvatarProps) {
  const [avatarUri, setAvatarUri] = useState(initialAvatarUrl);
  const [modalVisible, setModalVisible] = useState(false);


  const avatarImages = [
    {id: '1', uri: require('../assets/profile/8bit_bear.png')},
    {id: '2', uri: require('../assets/profile/8bit_cat.png')},
    {id: '3', uri: require('../assets/profile/8bit_chicken.png')},
    {id: '4', uri: require('../assets/profile/8bit_corgi.png')},
    {id: '5', uri: require('../assets/profile/8bit_penguin.png')},
    {id: '6', uri: require('../assets/profile/8bit_rat.png')}
  ]


  const handleAvatarChange = (uri: string) => {
    setAvatarUri(uri);
    setModalVisible(false);
    }


  return (
    <GestureHandlerRootView style={{ height: 120 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: avatarUri }}
              style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            />
        </TouchableOpacity>


        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Avatar</Text>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_bear.png")}
                >
                  <Image source={require("../assets/profile/8bit_bear.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_cat.png")}
                >
                  <Image source={require("../assets/profile/8bit_cat.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_chicken.png")}
                >
                  <Image source={require("../assets/profile/8bit_chicken.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_corgi.png")}
                >
                  <Image source={require("../assets/profile/8bit_corgi.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_penguin.png")}
                >
                  <Image source={require("../assets/profile/8bit_penguin.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAvatarChange("../assets/profile/8bit_rat.png")}
                >
                  <Image source={require("../assets/profile/8bit_rat.png")} style={styles.avatarOptionImage}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 100,
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
    zIndex: 0
  },
  modalTitle: {
    fontSize: 25,
    fontFamily: "PixelOperator-Bold",
    color: "white",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    fontFamily: "PixelOperator",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    paddingRight: 80,
    paddingBottom: 10
  },
  avatarOption: {
    margin: 10,
    padding: 5,
    alignItems: "center",
  },
  avatarOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 30
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    flex: 0,
    backgroundColor: "transparent",
    marginLeft: 80,
    //marginRight: 5,
    borderRadius: 20,
    width: "10%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#7F235A",
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator-Bold",
  },
});