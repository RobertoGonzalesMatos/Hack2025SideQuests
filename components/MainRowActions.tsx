import * as React from "react";
import { SymbolView } from "expo-symbols";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { CameraMode } from "expo-camera";
import { Colors } from "@/constants/Colors";

interface MainRowActionsProps {
  handleTakePicture: () => void;
  // handleTakeVideo: () => void;
  // isRecording: boolean;
}
export default function MainRowActions({
  // handleTakeVideo,
  handleTakePicture,
}: // isRecording,
MainRowActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleTakePicture}
        // onLongPress={handleTakeVideo}
      >
        <SymbolView
          name={"circle.circle"}
          size={90}
          type="hierarchical"
          tintColor={"white"}
          animationSpec={{
            effect: {
              type: "bounce",
            },
            repeating: false,
          }}
          fallback={
            <TouchableOpacity
              onPress={handleTakePicture}
              // onLongPress={handleTakeVideo}
              style={{
                width: 90,
                height: 90,
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 45,
                justifyContent: "center",
                alignItems: "center",
              }}
            ></TouchableOpacity>
          }
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
});
