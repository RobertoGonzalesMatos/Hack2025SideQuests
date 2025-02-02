import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../_layout";

export interface userLeaderBoardData {
  displayName: string;
  score: number;
  avatarUrl: string;
}

export default function LeaderboardScreen() {
  const [usersLead, setUsers] = useState<userLeaderBoardData[]>([]);
  const [refreshing, setRefreshing] = useState(false); // ✅ State for pull-to-refresh
  const [pressed, setPressed] = useState(false);
  const [pressed2, setPressed2] = useState(false);
  async function getAllUsers() {
    setRefreshing(true);
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const users = querySnapshot.docs.map((doc) => ({
        displayName: doc.data().displayName || "Anonymous",
        score: doc.data().score || 0,
        avatarUrl:
          doc.data().avatarUrl || "https://hackatbrown.org/img/logo.png",
      }));

      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setRefreshing(false);
  }
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getAllUsers} />
        } // ✅ Pull-to-refresh logic
      >
        {/* Leaderboard Title */}
        <Text style={styles.leaderboardText}>LEADERBOARD</Text>

        {/* Buttons Container */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, pressed ? styles.buttonPressed : null]}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setTimeout(() => setPressed(false), 75)}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}> TASKS </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, pressed2 ? styles.buttonPressed : null]}
            onPressIn={() => setPressed2(true)}
            onPressOut={() => setTimeout(() => setPressed2(false), 75)}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}> STREAK </Text>
          </TouchableOpacity>
        </View>

        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.columnHeaderRank}>RANK</Text>
          <Text style={styles.columnHeaderName}>NAME</Text>
          <Text style={styles.columnHeaderScore}>SCORE</Text>
        </View>

        {/* Leaderboard Entries */}
        {usersLead
          .sort((a, b) => b.score - a.score) // Sort by highest score
          .map((user, index) => {
            let textColorStyle = styles.defaultText; // Default color

            if (index === 0) {
              textColorStyle = styles.firstText;
            } else if (index === 1) {
              textColorStyle = styles.secondText;
            } else if (index === 2) {
              textColorStyle = styles.thirdText;
            }

            return (
              <View key={index} style={styles.leaderboardRow}>
                <Text style={[styles.rank, textColorStyle]}>{index + 1}</Text>
                <Text style={[styles.leaderboardName, textColorStyle]}>
                  {user.displayName}
                </Text>
                <Text style={[styles.leaderboardScore, textColorStyle]}>
                  {user.score}
                </Text>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#281C64",
    alignItems: "center",
    paddingTop: 50, // Moves everything down a bit
  },
  scrollViewContent: {
    padding: 16,
    alignItems: "center",
  },
  leaderboardText: {
    color: "white",
    fontSize: 40,
    fontFamily: "PixelOperator-Bold",
    textAlign: "center",
    marginBottom: 20, // Adds space between the title and buttons
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginTop: "2%",
  },
  button: {
    backgroundColor: "#EC2C5D",
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    width: "40%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
    marginBottom: "20%",
    shadowColor: "#7F235A",
    shadowOffset: { height: 15, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  buttonPressed: {
    backgroundColor: "#B5264B",
    shadowOffset: { height: 5, width: 0 },
    marginBottom: "20%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator-Bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingTop: 0,
    paddingBottom: 10,
    marginBottom: 10,
  },
  columnHeaderRank: {
    color: "white",
    fontSize: 26,
    fontFamily: "PixelOperator-Bold",
    // width: 40,
    flex: 2,
    textAlign: "center",
  },
  columnHeaderName: {
    color: "white",
    fontSize: 26,
    fontFamily: "PixelOperator-Bold",
    flex: 5,
    textAlign: "center",
  },
  columnHeaderScore: {
    color: "white",
    fontSize: 26,
    fontFamily: "PixelOperator-Bold",
    flex: 3,
    textAlign: "center",
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  leaderboardName: {
    color: "white",
    fontSize: 22,
    fontFamily: "PixelOperator",
    flex: 5,
    width: 40,
  },
  leaderboardScore: {
    color: "white",
    fontSize: 22,
    fontFamily: "PixelOperator",
    flex: 3,
  },
  rank: {
    color: "white",
    fontSize: 22,
    fontFamily: "PixelOperator-Bold",
    width: 40,
    textAlign: "center",
    flex: 2,
  },
  firstText: {
    color: "#EC2C5D",
    fontSize: 18,
    fontFamily: "SairaRegular",
    textAlign: "center",
  },
  secondText: {
    color: "#FC6840",
    fontSize: 18,
    fontFamily: "SairaRegular",
    textAlign: "center",
  },
  thirdText: {
    color: "#F8C93D",
    fontSize: 18,
    fontFamily: "SairaRegular",
    textAlign: "center",
  },
  defaultText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SairaBlack",
    textAlign: "center",
  },
});
