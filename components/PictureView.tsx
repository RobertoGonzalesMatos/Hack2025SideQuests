import { Image } from "expo-image";
import { Alert, View } from "react-native";
import IconButton from "./IconButton";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import * as ImageManipulator from "expo-image-manipulator"; // Import Image Manipulator
import * as FileSystem from "expo-file-system"; // For Base64 conversion
import { auth } from "@/app/_layout";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
  caption: string;
  points: string;
}

export default function PictureView({
  picture,
  setPicture,
  caption,
  points,
}: PictureViewProps) {
  const savePictureToFirestore = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("⚠️ Not logged in.");
        return;
      }

      // ✅ Compress Image before conversion
      const compressedImage = await ImageManipulator.manipulateAsync(
        picture,
        [{ resize: { width: 800 } }], // Resize width to 800px while maintaining aspect ratio
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG } // 60% compression
      );

      // ✅ Convert the compressed image to Base64
      const base64String = await FileSystem.readAsStringAsync(
        compressedImage.uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );

      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      // ✅ Fetch the current score first
      const userDoc = await getDoc(userRef);
      const currentScore = userDoc.exists() ? userDoc.data().score || 0 : 0;

      // ✅ Ensure points is an integer
      const parsedPoints = parseInt(points, 10) || 0; // Convert points to an integer (default to 0 if NaN)

      // ✅ Calculate new score
      const newScore = parseInt(currentScore, 10) + parsedPoints;

      // ✅ Save the compressed Base64 string and new score to Firestore
      await updateDoc(userRef, {
        latestPost: base64String,
        latestSidequest: caption,
        score: String(newScore), // Updated score with correct integer addition
      });

      Alert.alert("✅ Compressed picture saved to your profile!");
    } catch (error) {
      console.error("Error saving picture:", error);
      Alert.alert("❌ Failed to save picture.");
    }
  };

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
          paddingTop: 50,
          gap: 16,
        }}
      >
        <IconButton
          onPress={() => {
            savePictureToFirestore();
            setPicture("");
          }}
          iosName="square.and.arrow.up"
          androidName="close"
        />
      </View>

      <View
        style={{ position: "absolute", zIndex: 1, paddingTop: 50, left: 6 }}
      >
        <IconButton
          onPress={() => setPicture("")}
          iosName="xmark"
          androidName="close"
        />
      </View>

      <Image
        source={{ uri: picture }}
        style={{ height: "100%", width: "100%", borderRadius: 5 }}
      />
    </Animated.View>
  );
}
