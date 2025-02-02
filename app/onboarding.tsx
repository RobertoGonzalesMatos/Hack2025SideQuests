  import { Image, StyleSheet, Platform, Button, Alert, View, ScrollView, 
    TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } 
    from "react-native";
  import { HelloWave } from "@/components/HelloWave";
  import ParallaxScrollView from "@/components/ParallaxScrollView";
  import { ThemedText } from "@/components/ThemedText";
  import { ThemedView } from "@/components/ThemedView";
  import { SymbolView } from "expo-symbols";
  import { Colors } from "@/constants/Colors";
  import { useCameraPermissions, useMicrophonePermissions } from "expo-camera";
  import { router } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { ImageBackground } from "expo-image";
  import React, { useState } from 'react';

  export default function Onboarding() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] =
      useMicrophonePermissions();

    const handleContinue = async () => {
      const allPermissionsGranted = await requestAllPermissions();
      const phoneNumberValid = text.length === 10;
      if (allPermissionsGranted && phoneNumberValid) {
        // navigate to create profile
        router.replace("/createprofile");
      } else {
        if (!allPermissionsGranted) {
          Alert.alert("To continue, please provide permissions in settings.");
        } else if (!phoneNumberValid) {
          Alert.alert("Please enter a valid 10-digit phone number.");
        }
      }
    };

    async function requestAllPermissions() {
      const cameraStatus = await requestCameraPermission();
      if (!cameraStatus.granted) {
        Alert.alert("Error", "Camera permission is required.");
        return false;
      }

      const microphoneStatus = await requestMicrophonePermission();
      if (!microphoneStatus.granted) {
        Alert.alert("Error", "Microphone permission is required.");
        return false;
      }
      await AsyncStorage.setItem("hasOpened", "true");
      return true;
    }

  const [text, setText] = useState('');

  const handleTextChange = (newText: string) => {
    const cleanedText = newText.replace(/[^0-9]/g, "");
    setText(cleanedText);
  };

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackground  
        source={require('../assets/images/onboardingbg.png')} 
        style={styles.image}>
          <ImageBackground
            source={require('../assets/images/textinput.png')}
            style={styles.textInputBackground}
          >
            <TextInput
              style={styles.textInput}
              placeholder="enter phone number"
              placeholderTextColor="#CACACA"
              onChangeText={handleTextChange}
              value={text}
              keyboardType="numeric"
              maxLength={10}
            />
          </ImageBackground>
          <TouchableOpacity style={styles.startButton} onPress={handleContinue}>
            <Text style={styles.startButtonText}>press start</Text>
          </TouchableOpacity>
          <ScrollView
            headerBackgroundColor={{
              light: Colors.light.background,
              dark: Colors.dark.background,
            }}
            headerImage={
              <SymbolView
                name="camera.circle"
                size={250}
                type="hierarchical"
                animationSpec={{
                  effect: {
                    type: "bounce",
                  },
                }}
                tintColor={Colors.light.icon}
                fallback={
                  <Image
                    source={require("@/assets/images/partial-react-logo.png")}
                    style={styles.reactLogo}
                  />
                }
              />
            }
          >
          </ScrollView> 
        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>
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
    container: {
      flex: 1,
      backgroundColor: "#281C64"
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    startButton: {
      paddingTop: '5%',
      alignItems: 'center'
    },
    startButtonText: {
      color: 'white',
      fontSize: 40,
      fontFamily: 'PixelOperatorBold'
    },
    textInputBackground:{
      width: '90%',      
      height: 60,     
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: '110%',    
      overflow: 'hidden',
    },
    textInput: {
      width: '100%',
      height: '100%', 
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 26,
      fontFamily: 'SairaBlack'
    }
  });
