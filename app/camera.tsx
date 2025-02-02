import {
  Image,
  StyleSheet,
  Platform,
  Button,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { CameraType, CameraView } from "expo-camera";
import IconButton from "@/components/IconButton";
import MainRowActions from "@/components/MainRowActions";
import PictureView from "@/components/PictureView";
import VideoViewComponent from "@/components/VideoView";

export default function CameraScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [video, setVideo] = React.useState("");
  const [picture, setPicture] = React.useState("");
  // const [preview, setPreview] = React.useState(false);
  const [backCam, setCameraType] = React.useState<boolean>(true);
  const { quest, points } = useLocalSearchParams();

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    setPicture(response!.uri);
  }

  // function handlePreview() {
  //   setPreview(true);
  // }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      try {
        const response = await cameraRef.current?.recordAsync({});
        setVideo(response!.uri);
      } catch (error) {
        console.error("Error recording video:", error);
      }
    }
  }

  if (picture)
    return (
      <PictureView
        picture={picture}
        setPicture={setPicture}
        caption={quest as string}
        points={points as string}
      />
    );
  // if (preview)
  //   return <VideoViewComponent video={video} setPreview={setPreview} />;
  function toggleCamera() {
    setCameraType(!backCam);
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        mode="video"
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={backCam ? "back" : "front"}
      >
        <View style={styles.topBar}>
          <IconButton
            iosName="xmark.circle"
            androidName="close"
            containerStyle={styles.iconCircle}
            onPress={() => {
              router.back();
            }}
          />
          <IconButton
            iosName="arrow.triangle.2.circlepath"
            androidName="close"
            containerStyle={styles.iconCircle}
            onPress={toggleCamera}
          />
        </View>
        <View style={styles.questContainer}>
          <Text style={styles.text}>{quest}</Text>
        </View>
        <MainRowActions
          handleTakePicture={() => {
            handleTakePicture();
          }}
          // handleTakeVideo={toggleRecord}
          // isRecording={isRecording}
        ></MainRowActions>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  iconButton: {
    position: "absolute",
    bottom: 20, // Distance from the bottom of the screen
    alignSelf: "center", // Center horizontally
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    height: 100,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  previewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
  },
  previewText: {
    fontSize: 16,
    color: "black",
  },
  questContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: "black",
    alignSelf: "center",
  },
});
