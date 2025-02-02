import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFirstTimeOpen } from "@/hooks/useFirstTimeOpen";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../_layout";

async function createUserDoc(user: User) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "Anonymous",
      createdAt: new Date(),
      followers: 0,
      following: 0,
      score: 0,
      avatarUrl: "https://hackatbrown.org/img/logo.png", // Default avatar
      latestSidequest: "none",
    });
    console.log("User document created in Firestore");
  }
}

export interface UserData {
  displayName: string;
  followers: number;
  following: number;
  score: number;
  avatarUrl: string;
  latestPost: string;
  latestSidequest: string;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isFirstTime, isLoading } = useFirstTimeOpen();
  const [isAuthChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if no user is found
        router.replace("/login");
      } else {
        createUserDoc(user);
        setUser(user);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);
  if (isLoading) return <></>;
  if (isFirstTime) return <Redirect href={"/onboarding"} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Transparent background on iOS
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontFamily: "PixelOperator",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        initialParams={{ user }}
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              defaultSize={28}
              activeSize={26}
              image={require("../../assets/icons/home.png")} // Default icon
              activeImage={require("../../assets/icons/home_active_new2.png")} // Active icon
              isActive={focused} // Determines which icon to display
            />
          ),
        }}
      />
      <Tabs.Screen
        initialParams={{ user }}
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              defaultSize={28}
              activeSize={30}
              image={require("../../assets/icons/trophy.png")} // Default icon
              activeImage={require("../../assets/icons/trophy_active.png")} // Active icon
              isActive={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        initialParams={{ user: JSON.stringify(user) }}
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              defaultSize={28}
              activeSize={28}
              image={require("../../assets/icons/heart.png")} // Default icon
              activeImage={require("../../assets/icons/heart_active.png")} // Active icon
              isActive={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        initialParams={{ user }}
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              defaultSize={35}
              activeSize={24}
              image={require("../../assets/icons/person.png")} // Default icon
              activeImage={require("../../assets/icons/person_active.png")} // Active icon
              isActive={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
