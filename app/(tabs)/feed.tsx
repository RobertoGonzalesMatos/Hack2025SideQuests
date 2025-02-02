import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Avatar from "@/components/Avatar";
import { Video } from "expo-av";

interface UserData {
  displayName: string;
  followers: number;
  following: number;
  score: number;
  latestPost?: string; // ✅ Base64 image
  latestSidequest: string;
  avatarUrl: string;
}

export default function UsersScreen() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [refreshing, setRefreshing] = useState(false); // ✅ State for pull-to-refresh

  // ✅ Function to fetch user data
  const fetchUsersData = useCallback(async () => {
    try {
      setRefreshing(true); // Show spinner
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const users: UserData[] = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data() as UserData);
      });

      setUsersData(users);
    } catch (error) {
      console.error("❌ Error fetching users data:", error);
    } finally {
      setRefreshing(false); // Hide spinner
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/gifs/sparkle3.gif")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={styles.videoOverlay} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsersData} />
        }
      >
        <Text style={styles.leaderboardText}>FEED</Text>

        {usersData.map((user, index) => (
          <View key={index} style={styles.userContainer}>
            <View style={styles.profileContainer}>
              <Avatar
                initialAvatar={user.avatarUrl}
                size={50}
                score={user.score}
              />
              <Text style={styles.textPOUsername}>{user.displayName}</Text>
            </View>
            <View style={styles.imageContainer}>
              {user.latestPost ? (
                <Image
                  source={{ uri: `data:image/png;base64,${user.latestPost}` }}
                  style={styles.image}
                />
              ) : (
                <Text style={styles.noPostText}>No posts yet.</Text>
              )}
              <View style={styles.overlay}>
                <Text style={styles.sidequestText}>{user.latestSidequest}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignItems: "center",
    marginBottom: 40,
    width: "110%",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 10,
    paddingBottom: 30,
  },

  imageContainer: {
    position: "relative",
    marginTop: -55
  },
  container: {
    flex: 1,
    backgroundColor: "#281C64",
    alignItems: "center",
    paddingTop: 50,
  },
  scrollViewContent: {
    padding: 16,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
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
    marginTop: -55,
    marginBottom: 15,
    marginInline: 15,
    marginRight: 5,
    color: "white",
    fontSize: 23,
    fontFamily: "PixelOperator-Bold",
  },
  textSar: {
    color: "white",
    fontSize: 20,
    fontFamily: "SairaBlack",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  sidequestText: {
    color: "white",
    fontSize: 18,
    fontFamily: "PixelOperator",
    marginRight: 20
  },
  noPostText: {
    color: "white",
    marginTop: 20,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(77, 40, 105, 0.55)", // Adjust the opacity as needed
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "lightgray",
    opacity: 0.5,
    marginTop: 50,
    width: "100%",
    alignSelf: "center",
  },
  leaderboardText: {
    color: "white",
    fontSize: 40,
    fontFamily: "PixelOperator-Bold",
    textAlign: "center",
    marginBottom: 20, // Adds space between the title and buttons
  },
});
