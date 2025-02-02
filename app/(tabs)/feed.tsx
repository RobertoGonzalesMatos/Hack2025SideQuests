import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  RefreshControl,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Avatar from "@/components/Avatar";

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
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsersData} />
        } // ✅ Pull-to-refresh logic
      >
        {usersData.map((user, index) => (
          <View key={index} style={styles.userContainer}>
            <View style={styles.profileContainer}>
              <Avatar initialAvatarUrl={user.avatarUrl} size={60} />
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
    width: "100%",
  },

  imageContainer: {
    position: "relative",
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
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
    marginBottom: 15,
    marginInline: 15,
    color: "white",
    fontSize: 30,
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
  },
  noPostText: {
    color: "white",
    marginTop: 20,
  },
});
