import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import Avatar from "@/components/Avatar";
import { User } from "firebase/auth";
import { UserData } from "./_layout";

export default function TabTwoScreen() {
  const params = useLocalSearchParams();
  let user: User | null;

  try {
    user = params.user ? JSON.parse(params.user as string) : null;
  } catch (error) {
    console.error("Error parsing user:", error);
    user = null;
  }

  const [userData, setUserData] = useState({
    displayName: "Loading...",
    followers: 0,
    following: 0,
    score: 0,
    avatarUrl: "https://hackatbrown.org/img/logo.png",
    latestPost: "",
  });

  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchUserData = async () => {
      if (!user || !user.uid) return;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserData; // ✅ Explicitly cast data
        setUserData(userData);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}> SETTINGS </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}> COMPLETED QUESTS </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}> ABOUT </Text>
        </TouchableOpacity>
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
    marginTop: 16,
    width: "80%",
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
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator-Bold",
  },
});
