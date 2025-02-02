import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import Avatar from "@/components/Avatar";
import { User } from "firebase/auth";
import { UserData } from "./_layout";
import { Video } from "expo-av";

import { auth } from "../_layout";

export default function TabTwoScreen() {
  const [userData, setUserData] = useState({
    displayName: "Loading...",
    followers: 0,
    following: 0,
    score: 0,
    avatarUrl: "https://hackatbrown.org/img/logo.png",
    latestPost: "",
  });
  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const [username, setUsername] = useState("User123");
  const [newFollower, setNewFollower] = useState("");
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    if (!auth.currentUser || !auth.currentUser.uid) return;

    const fetchUserData = async () => {
      if (!auth.currentUser || !auth.currentUser.uid) return;
      const db = getFirestore();
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData;
        setUserData(userData);
        setUsername(userData.displayName || "User123");
        setFollowing(userData.followingUsers || []);
      }
    };

    fetchUserData();
  }, [auth.currentUser]);

  const handleFollow = async () => {
    if (!auth.currentUser || !auth.currentUser.uid) return;
    if (newFollower.trim() !== "" && !following.includes(newFollower)) {
      setFollowing([...following, newFollower]);
      setNewFollower("");
      const db = getFirestore();
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        following: arrayUnion(newFollower),
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!auth.currentUser || !auth.currentUser.uid) return;

    console.log("Saving changes...", { username, followers, following });
    const db = getFirestore();
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      displayName: username,
      followingUsers: following,
      following: following.length,
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
                source={require("../../assets/gifs/sparkle4.gif")}
                resizeMode="cover"
                style={styles.backgroundImage} />
              <View style={styles.videoOverlay} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Picture and Username */}
        <View style={styles.profileContainer}>
          <Avatar initialAvatarUrl={userData.avatarUrl} size={100} />
          <Text style={styles.textPOUsername}>{userData.displayName}</Text>
        </View>

        {/* Follower, Following, and Score Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.textSar}>{userData.followers}</Text>
            <Text style={styles.textPOLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.textSar}>{userData.following}</Text>
            <Text style={styles.textPOLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.textSar}>{userData.score}</Text>
            <Text style={styles.textPOLabel}>Score</Text>
          </View>
        </View>

        {/* Buttons */}
        {/* <View style={styles.container}> */}
        {/* SETTINGS BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible("settings")}
        >
          <Text style={styles.buttonText}> SETTINGS </Text>
        </TouchableOpacity>

        {/* COMPLETED QUESTS BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible("quests")}
        >
          <Text style={styles.buttonText}> COMPLETED QUESTS </Text>
        </TouchableOpacity>

        {/* ABOUT BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible("about")}
        >
          <Text style={styles.buttonText}> ABOUT </Text>
        </TouchableOpacity>

        {/* SETTINGS MODAL */}
        <Modal
          visible={modalVisible === "settings"}
          transparent
          animationType="slide"
          style={styles.modalContainer}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>
              <Text style={styles.modalText}>
                Configure your preferences here.
              </Text>
              {/* Change Username */}
              <TextInput
                style={styles.modalText}
                placeholder="Enter new username"
                placeholderTextColor="#bbb"
                value={username}
                onChangeText={setUsername}
              />
              {/* Follow Users */}
              <TextInput
                style={styles.modalText}
                placeholder="Enter username to follow"
                placeholderTextColor="#bbb"
                value={newFollower}
                onChangeText={setNewFollower}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleFollow}
              >
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
              {/* Followers List */}
              {/* <Text style={styles.modalTitle}>Followers</Text>
              <FlatList
                data={followers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.modalText}>{item}</Text>
                )}
              /> */}
              {/* Following List */}
              {/* <Text style={styles.modalTitle}>Following</Text>
              <FlatList
                data={following}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.modalText}>{item}</Text>
                )}
              /> */}
              {/* Save Button */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button2}
                onPress={() => setModalVisible(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* COMPLETED QUESTS MODAL */}
        <Modal
          visible={modalVisible === "quests"}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Completed Quests</Text>
              <Text style={styles.modalText}>
                Here are your completed quests.
              </Text>

              <TouchableOpacity
                style={styles.button2}
                onPress={() => setModalVisible(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ABOUT MODAL */}
        <Modal
          visible={modalVisible === "about"}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>About</Text>
              <Text style={styles.modalText}>
                Here are your completed quests.
              </Text>

              <TouchableOpacity
                style={styles.button2}
                onPress={() => setModalVisible(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#281C64",
  },
  scrollViewContent: {
    padding: 16,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginBottom: 15
  },
  statItem: {
    alignItems: "center",
  },
  textPOLabel: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator",
  },
  textPOUsername: {
    marginTop: 15,
    color: "white",
    fontSize: 30,
    fontFamily: "PixelOperator-Bold",
  },
  textSar: {
    color: "white",
    fontSize: 20,
    fontFamily: "SairaBlack",
  },
  button: {
    flex: 1,
    backgroundColor: "#EC2C5D",
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#7F235A",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  button2: {
    flex: 0,
    backgroundColor: "#EC2C5D",
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#7F235A",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator-Bold",
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(36, 16, 59, 0.55)', // Adjust the opacity as needed
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '120%',
    height: '120%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark transparent overlay
  },
  modalContent: {
    backgroundColor: "#1E1449", // Dark background matching the theme
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
  modalText: {
    fontSize: 18,
    fontFamily: "PixelOperator",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#EC2C5D",
    borderRadius: 20,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7F235A",
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});
