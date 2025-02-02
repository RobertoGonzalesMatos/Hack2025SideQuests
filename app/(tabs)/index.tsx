import {
  Modal,
  TouchableOpacity,
  ImageBackground,
  Text,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Platform,
  Button,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { VideoSource, useVideoPlayer, VideoView } from "expo-video";
import { AVPlaybackStatus, Video } from "expo-av";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withSpring,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { openai } from "../_layout";

interface quest {
  id: number;
  description: string;
  points: number;
  disabled: boolean;
}

export default function HomeScreen() {
  const [timeUntilMidnight, setTimeUntilMidnight] = useState(() =>
    getTimeUntilMidnight()
  );
  const [loading, setLoading] = useState(true); // ✅ Loading state for the spinning wheel

  const [modalVisible, setModalVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isTicketVisible, setIsTicketVisible] = useState(false);
  const ticketY = useSharedValue(300);
  const lottoOpacity = useSharedValue(1.0);
  const [isSpinVisible, setIsSpinVisible] = useState(false);
  const [isGotItVisible, setIsGotItVisible] = useState(false);
  const gotItOpacity = useSharedValue(0);
  const { user } = useLocalSearchParams(); // Get user from params
  const [gemQuests, setGemQuests] = useState<quest[]>([]);

  const parseSidequests = (responseText: string): quest[] => {
    const quests: quest[] = [];
    const challenges = responseText.split("||");

    challenges.forEach((challenge, index) => {
      const match = challenge.match(/(.+?)\s*\((\d+)\s*points\)/);

      if (match) {
        quests.push({
          id: index + 1,
          description: match[1].trim().slice(3), // Extracts the challenge description
          points: parseInt(match[2], 10), // Extracts the points
          disabled: false,
        });
      }
    });

    return quests;
  };

  const handlePropGeneration = async () => {
    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content:
              "Hi, please write 5 challenges/real-life sidequests that I could do to go out of my comfort zone, have fun, discover places, do a new activity or anything that you may think could be interesting to do. Separate the challenges by || and award a certain number of points depending on the difficulty from 5 to 25. Each challenge should be made with at most 12 words. Try to make each challenge as specific, creative and interesting as possible. If you can make the side quest be able to be completed in 1 day. Please make the challenges similar to the following: pet 5 dogs, talk to a stranger, ask a barista their favorite drink and order it, Cook something without a recipe, Play trivia of each other, have a goofy/thematic Photoshoot, Mock Olympics with fun competitions. Please make your response at max 500 characters and only include the challenges.",
          },
        ],
      });

      // Make sure that `completion` has the expected structure
      if (completion && completion.choices && completion.choices.length > 0) {
        if (!completion.choices[0].message.content) {
          return;
        }
        const responseText = completion.choices[0].message.content.trim(); // Ensure it's a string
        if (responseText) {
          const parsedQuests = parseSidequests(responseText);
          setGemQuests(parsedQuests);
        }
      } else {
        console.error("Invalid response format from OpenAI:", completion);
      }
    } catch (error) {
      console.error("Error generating sidequests:", error);
    }
    setLoading(false);
  };

  const handleFinished = () => {
    setIsTicketVisible(true);
    ticketY.value = withTiming(200, { duration: 500, easing: Easing.ease });
    lottoOpacity.value = withTiming(0, { duration: 300, easing: Easing.ease });

    setTimeout(() => {
      setIsGotItVisible(true);
      gotItOpacity.value = withTiming(1.0, {
        duration: 100,
        easing: Easing.ease,
      });
    }, 900);
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        handleFinished();
      }
    }
  };

  useEffect(() => {
    handlePropGeneration();
    const interval = setInterval(() => {
      setTimeUntilMidnight(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const video = useRef<Video>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handlePlayVideo = () => {
    if (video.current) {
      video.current.playAsync();
    }
  };

  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    -now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      > */}
      <Text style={styles.goldenTicketAnnounceText}>GOLD-TIER QUEST!</Text>
      <TouchableOpacity
        style={styles.goldenTicketImage}
        onPress={() => {
          setModalVisible(true);
          setIsSpinVisible(true);
          setIsGotItVisible(false);
          lottoOpacity.value = 1.0;
        }}
      >
        <ImageBackground
          source={require("../../assets/images/ticketGold.png")}
          style={styles.goldenTicketImage}
          resizeMode="contain"
        >
          <Text style={styles.goldenTicketText}>500</Text>
        </ImageBackground>
        <Text style={styles.goldenTicketDescriptionText}>Win a hackathon</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setIsTicketVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={30} style={styles.blurView}>
            <View style={styles.modalContent}>
              {isTicketVisible && (
                <Animated.View
                  style={[
                    styles.animatedTicket,
                    { transform: [{ translateY: ticketY }] },
                  ]}
                >
                  <ImageBackground
                    source={require("../../assets/images/ticketGold.png")}
                    style={styles.goldenTicketImage}
                    resizeMode="contain"
                  >
                    <Text style={styles.goldenTicketText}>200</Text>
                  </ImageBackground>
                  <Text style={styles.goldenTicketDescriptionText}>
                    Win a Hackathon.
                  </Text>
                </Animated.View>
              )}
              <Text style={styles.modalAnnounceText}>
                SPIN TO GET YOUR GOLD SIDEQUEST!
              </Text>
              <Animated.View
                style={[styles.animatedLotto, { opacity: lottoOpacity }]}
              >
                <Video
                  style={styles.video}
                  ref={video}
                  source={require("../../assets/videos/lottery.mp4")}
                  useNativeControls={false}
                  shouldPlay={false}
                  isLooping={false}
                  onLoad={() => setIsVideoLoaded(true)}
                  onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
              </Animated.View>
              {isSpinVisible && (
                <TouchableOpacity
                  style={styles.buttonImage}
                  onPress={() => {
                    handlePlayVideo();
                    setIsSpinVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>SPIN!</Text>
                </TouchableOpacity>
              )}
              {isGotItVisible && (
                <Animated.View style={[{ opacity: gotItOpacity }]}>
                  <Text style={styles.goldenTicketDescriptionText}>
                    Complete this sidequest before anyone else to get all of the
                    points!
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonImage}
                    onPress={() => {
                      setModalVisible(false);
                      setIsTicketVisible(false);
                      router.push({
                        pathname: "/camera",
                        params: {
                          quest: "Quest * Win a hackathon",
                        },
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>GOT IT!</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </BlurView>
        </View>
      </Modal>

      <View style={styles.infoContainer}>
        <View style={styles.columnLeft}>
          <Text style={styles.infoTextHeader}>GEM QUESTS</Text>
          <Text style={styles.infoText}>reset daily at 12am</Text>
        </View>
        <View style={styles.columnRight}>
          <Text style={styles.infoTextHeader}>TIME LEFT</Text>
          <Text style={styles.infoText}>{getTimeUntilMidnight()}</Text>
        </View>
      </View>

      <View>
        {loading ? (
          // ✅ Show spinning wheel while loading
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.loadingSpinner}
          />
        ) : (
          gemQuests.map((quest) => (
            <TouchableOpacity
              style={[
                styles.gemQuestContainer,
                quest.disabled ? styles.disabledQuest : {}, // Apply disabled styles
              ]}
              key={quest.id}
              onPress={() => {
                setGemQuests((prevQuests) =>
                  prevQuests.map((q) =>
                    q.id === quest.id ? { ...q, disabled: true } : q
                  )
                );
                router.push({
                  pathname: "/camera",
                  params: {
                    quest: `Quest * ${quest.description}`,
                    points: quest.points,
                  },
                });
              }}
              disabled={quest.disabled} // ✅ Disable button interaction
            >
              <View
                style={[
                  styles.rowContainer,
                  quest.disabled && styles.disabledQuest, // Apply disabled styles if `quest.disabled` is true
                ]}
              >
                <ImageBackground
                  source={require("../../assets/images/ticketNormal.png")}
                  style={[
                    styles.goldenTicketImageSmall, // ✅ Always apply base style
                    quest.disabled && styles.disabledImage, // ✅ Only apply if `quest.disabled` is true
                  ]}
                  resizeMode="contain"
                >
                  <Text
                    style={[
                      styles.gemQuestText,
                      quest.disabled && styles.disabledText,
                    ]}
                  >
                    {quest.points}
                  </Text>
                </ImageBackground>
                <Text
                  style={[
                    styles.gemQuestDescriptionText,
                    quest.disabled && styles.disabledText,
                  ]}
                >
                  {quest.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  disabledQuest: {
    opacity: 0.5, // Make the whole row appear faded
  },
  disabledImage: {
    opacity: 0.3, // ✅ Reduce opacity for a "disabled" effect
  },
  disabledText: {
    color: "#a0a0a0", // Make text gray to indicate disabled state
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#281C64",
    justifyContent: "center",
    alignItems: "center",
  },
  textPO: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator",
  },
  textPOBold: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator-Bold",
  },
  textSar: {
    color: "white",
    fontSize: 20,
    fontFamily: "SairaBlack",
  },
  goldenTicketImage: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  goldenTicketText: {
    fontSize: 70,
    fontFamily: "PixelOperator",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
  },
  goldenTicketAnnounceText: {
    color: "white",
    fontSize: 40,
    fontFamily: "PixelOperatorBold",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
  },
  goldenTicketDescriptionText: {
    color: "white",
    fontSize: 25,
    fontFamily: "PixelOperator",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
  },
  columnLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  columnRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoTextHeader: {
    color: "white",
    fontSize: 30,
    fontFamily: "PixelOperatorBold",
    marginBottom: 10,
  },
  loadingSpinner: {
    marginTop: 100,
  },
  infoText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator",
    marginBottom: 10,
  },
  gemQuestContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingLeft: 0,
  },
  gemQuestDescriptionText: {
    color: "white",
    fontSize: 20,
    fontFamily: "PixelOperator",
    alignContent: "center",
    textAlign: "left",
    width: 250,
  },
  gemQuestText: {
    fontSize: 25,
    fontFamily: "PixelOperator",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
    color: "white",
  },
  goldenTicketImageSmall: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    height: 65,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#281c64",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "80%",
  },
  video: {
    width: "100%",
    height: 250,
  },
  modalAnnounceText: {
    color: "white",
    fontSize: 30,
    fontFamily: "PixelOperatorBold",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
  },
  blurView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 60,
    fontFamily: "PixelOperator-Bold",
    alignContent: "center",
    textAlign: "center",
    padding: 12,
  },
  buttonImage: {
    width: "85%",
    borderRadius: 20,
    backgroundColor: "#EC2C5D",
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 20,
    shadowColor: "#7F235A",
    shadowOffset: { height: 20, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 1,
    alignSelf: "center",
  },
  animatedTicket: {
    position: "absolute",
    top: 0,
    width: "70%",
    alignItems: "center",
    zIndex: 1000,
  },
  animatedLotto: {
    width: "100%",
    height: 250,
  },
});
