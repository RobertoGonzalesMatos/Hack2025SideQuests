import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, Button, View } from "react-native";
import IconButton from "./IconButton";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface VideoViewProps {
  video: string;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function VideoViewComponent({
  video,
  setPreview,
}: VideoViewProps) {
  const ref = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (event) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 100,
          gap: 16,
        }}
      >
        <IconButton
          onPress={() => {
            player.pause();
            setPreview(false);
          }}
          iosName={"xmark"}
          androidName="close"
        />
        <IconButton
          onPress={async () => {
            Alert.alert("✅ video saved!");
          }}
          iosName={"arrow.down"}
          androidName="close"
        />
        <IconButton iosName={"square.and.arrow.up"} androidName="close" />
        <IconButton
          iosName={isPlaying ? "pause" : "play"}
          androidName={isPlaying ? "pause" : "play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View>
      <VideoView
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        player={player}
        allowsFullscreen
        nativeControls={true}
      />
    </Animated.View>
  );
}
