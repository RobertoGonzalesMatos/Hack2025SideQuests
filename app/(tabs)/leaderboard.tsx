import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
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
      <ImageBackground
        source={require("../../assets/gifs/sparkle2.gif")}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={styles.videoOverlay} />
      <Text style={styles.leaderboardText}>LEADERBOARD</Text>

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
          <Text style={styles.buttonText}> STREAKS </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.columnHeaderRank}>RANK</Text>
        <Text style={styles.columnHeaderName}>NAME</Text>
        <Text style={styles.columnHeaderScore}>SCORE</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getAllUsers} />
        }
      >
        {usersLead
          .sort((a, b) => b.score - a.score)
          .map((user, index) => {
            let textColorStyle = styles.defaultText;

            if (index === 0) {
              textColorStyle = styles.firstText;
            } else if (index === 1) {
              textColorStyle = styles.secondText;
            } else if (index === 2) {
              textColorStyle = styles.thirdText;
            }

            return (
              <View key={index} style={styles.rankingBox}>
                <View style={styles.leaderboardRow}>
                  <Text style={[styles.rank, textColorStyle]}>{index + 1}</Text>
                  <Text style={[styles.leaderboardName, textColorStyle]}>
                    {user.displayName}
                  </Text>
                  <Text style={[styles.leaderboardScore, textColorStyle]}>
                    {user.score}
                  </Text>
                </View>
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
    paddingTop: 100, // Moves everything down a bit
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
    marginBottom: 0, // Adds space between the title and buttons
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginTop: "0%",
  },
  button: {
    backgroundColor: "#EC2C5D",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 20,
    width: "40%",
    height: "35%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 0,
    marginBottom: "1%",
    shadowColor: "#7F235A",
    shadowOffset: { height: 15, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  buttonPressed: {
    backgroundColor: "#B5264B",
    shadowOffset: { height: 15, width: 0 },
    marginBottom: "1%",
    marginVertical: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontFamily: "PixelOperator-Bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
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
    fontSize: 20,
    // fontFamily: "SairaRegular",
    fontFamily: "SairaBold",
    textAlign: "center",
  },
  secondText: {
    color: "#FC6840",
    fontSize: 20,
    fontFamily: "SairaBold",
    textAlign: "center",
  },
  thirdText: {
    color: "#F8C93D",
    fontSize: 20,
    fontFamily: "SairaBold",
    textAlign: "center",
  },
  defaultText: {
    color: "white",
    fontSize: 18,
    fontFamily: "SairaBlack",
    textAlign: "center",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(36, 16, 59, 0.55)", // Adjust the opacity as needed
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "110%",
  },
  rankingBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
});
