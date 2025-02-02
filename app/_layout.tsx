import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { getFirestore } from "firebase/firestore";
import { FirebaseApp, initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, onAuthStateChanged } from "firebase/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const firebaseConfig = {
  apiKey: "AIzaSyDcWby2uUOzKhuUq48Iw0_w-1obwx8DCC0",
  authDomain: "sidequest-2b00f.firebaseapp.com",
  projectId: "sidequest-2b00f",
  storageBucket: "sidequest-2b00f.firebasestorage.app",
  messagingSenderId: "513142405673",
  appId: "1:513142405673:web:b94b8a1779aa70476cba38",
  measurementId: "G-60CML52VZK",
};

const app = initializeApp(firebaseConfig);
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const auth = initializeAuth(app, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage),
});

import OpenAI from "openai";
import Constants from "expo-constants";

const openai = new OpenAI({
  apiKey:,
});
const db = getFirestore(app);
export { auth, db, openai };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),

    PixelOperator: require("../assets/fonts/pixel_operator/PixelOperator.ttf"),
    PixelOperatorBold: require("../assets/fonts/pixel_operator/PixelOperator-Bold.ttf"),
    PixelOperatorHB: require("../assets/fonts/pixel_operator/PixelOperatorHB.ttf"),

    SairaBlack: require("../assets/fonts/saira/Saira-Black.ttf"),
    SairaBlackItalic: require("../assets/fonts/saira/Saira-BlackItalic.ttf"),
    SairaBold: require("../assets/fonts/saira/Saira-Bold.ttf"),
    SairaBoldItalic: require("../assets/fonts/saira/Saira-BoldItalic.ttf"),
    SairaExtraBold: require("../assets/fonts/saira/Saira-ExtraBold.ttf"),
    SairaExtraBoldItalic: require("../assets/fonts/saira/Saira-ExtraBoldItalic.ttf"),
    SairaExtraLight: require("../assets/fonts/saira/Saira-ExtraLight.ttf"),
    SairaExtraLightItalic: require("../assets/fonts/saira/Saira-ExtraLightItalic.ttf"),
    SairaItalic: require("../assets/fonts/saira/Saira-Italic.ttf"),
    SairaLight: require("../assets/fonts/saira/Saira-Light.ttf"),
    SairaLightItalic: require("../assets/fonts/saira/Saira-LightItalic.ttf"),
    SairaMedium: require("../assets/fonts/saira/Saira-Medium.ttf"),
    SairaMediumItalic: require("../assets/fonts/saira/Saira-MediumItalic.ttf"),
    SairaRegular: require("../assets/fonts/saira/Saira-Regular.ttf"),
    SairaSemiBold: require("../assets/fonts/saira/Saira-SemiBold.ttf"),
    SairaSemiBoldItalic: require("../assets/fonts/saira/Saira-SemiBoldItalic.ttf"),
    SairaThin: require("../assets/fonts/saira/Saira-Thin.ttf"),
    SairaThinItalic: require("../assets/fonts/saira/Saira-ThinItalic.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="createprofile"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
          }}
        />
        {/* <Stack.Screen
          name="onboarding"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            animation: "fade",
          }}
        /> */}
        <Stack.Screen
          name="camera"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
            animation: "fade",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
