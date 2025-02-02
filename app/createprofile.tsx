import { Image, StyleSheet, Platform, Button, Alert, View, ScrollView, 
    TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard,
    KeyboardAvoidingView } from "react-native";
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
  import * as ImagePicker from "expo-image-picker";

  export default function CreateProfile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  const [profilePic, setProfilePic] = useState('');

  const [pressed, setPressed] = useState(false);
    
  const handleContinue = async () => {
    if ((firstName.length > 0) && (lastName.length > 0) && (username.length > 0)) { 
        router.replace("/(tabs)");
    } 
    else {
        Alert.alert("Please input a value for all fields.");
      }
    };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("We need access to your photo library to set a profile picture.");
      return;
    }

  const image = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!image.canceled) {
    setProfilePic(image.assets[0].uri);
  }
};

const [firstNameFocused, setFirstNameFocused] = useState(false);
const [lastNameFocused, setLastNameFocused] = useState(false); 
const [usernameFocused, setUsernameFocused] = useState(false); 

  return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <ImageBackground  
                      source={require('../assets/images/createprobg.png')} 
                      style={styles.image}>
                <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                  <ImageBackground
                      source={profilePic ? { uri: profilePic } : require('../assets/images/propicplaceholder.png')}
                      style={styles.profilePic}
                      imageStyle={{ borderRadius: 75 }}
                  />
                    <Image style={styles.frame}
                    source={require('../assets/images/propicframe.png')}/>
                  <TouchableOpacity style={{width: 200, alignSelf: 'center'}} onPress={handleAddPhoto}>
                    <Text style={styles.changePhoto} > change photo </Text>
                  </TouchableOpacity>
                  <ScrollView style={styles.scrollContainer}>
                      <ImageBackground
                          source={firstName || firstNameFocused ? require('../assets/images/textinput.png') : require('../assets/images/firstname.png')}
                          style={styles.textInputBackground}
                      >
                          <TextInput
                          style={[styles.textInput, {backgroundColor: firstNameFocused ? '#FFFFFF' : 'transparent'}]}
                          value={firstName}
                          onChangeText={setFirstName}
                          onFocus={() => setFirstNameFocused(true)}
                          onBlur={() => setFirstNameFocused(false)}
                          />
                      </ImageBackground>
                      <ImageBackground
                          source={lastName || lastNameFocused ? require('../assets/images/textinput.png') : require('../assets/images/lastname.png')}
                          style={styles.textInputBackground}
                      >
                          <TextInput
                          style={[styles.textInput, {backgroundColor: lastNameFocused ? '#FFFFFF' : 'transparent'}]}
                          value={lastName}
                          onChangeText={setLastName}
                          onFocus={() => setLastNameFocused(true)}
                          onBlur={() => setLastNameFocused(false)}
                          />
                      </ImageBackground>
                      <ImageBackground
                          source={username || usernameFocused ? require('../assets/images/textinput.png') : require('../assets/images/username.png')}
                          style={styles.textInputBackground}
                      >
                          <TextInput
                          style={[styles.textInput, {backgroundColor: usernameFocused ? '#FFFFFF' : 'transparent'}]}
                          value={username}
                          onChangeText={setUsername}
                          onFocus={() => setUsernameFocused(true)}
                          onBlur={() => setUsernameFocused(false)}
                          />
                      </ImageBackground>
                  </ScrollView>
                </KeyboardAvoidingView>
                <TouchableOpacity style={[styles.button, pressed ? styles.buttonPressed : null]}
                 onPressIn={() => setPressed(true)}
                 onPressOut={() => setTimeout(() => setPressed(false), 75)}
                 onPress={handleContinue}
                 activeOpacity={1}>
                    <Text style={styles.buttonText} > GO! </Text>
                  </TouchableOpacity>
              </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  export const options = {
    headerShown: false,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#281C64"
    },
    frame: {
      width: 150,         
      height: 150,      
      resizeMode: 'contain', 
      alignSelf: 'center',
      marginTop: 65,
      position: 'relative'
    },
    profilePic: {
      width: 138,         
      height: 138,      
      resizeMode: 'contain', 
      alignSelf: 'center',
      top: 71,
      position: 'absolute',
      borderRadius: 75,
    },
    scrollContainer: {
      marginTop: '2%',
      paddingTop: "4%",
    },
    image: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    textInputBackground:{
      width: '90%',      
      height: 60,     
      alignSelf: 'center',
      alignItems: 'center',  
      overflow: 'hidden',
      marginTop: 25
    },
    textInput: {
      width: '80%',
      height: '80%', 
      marginTop: '1.75%',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 26,
      fontFamily: 'SairaRegukar'
    },
    button: {
      backgroundColor: '#EC2C5D',
      marginLeft: 5,
      marginRight: 5,
      borderRadius: 20,
      width: '50%',
      height: '10%',
      justifyContent: 'center',
      alignItems: 'center', 
      alignSelf: 'center',
      marginVertical: 20,
      marginBottom: '40%',
      shadowColor: '#7F235A',
      shadowOffset: { height: 15, width: 0 },
      shadowOpacity: 1,
      shadowRadius: 1,
    },
    buttonPressed: {
      backgroundColor: '#B5264B',
      shadowOffset: { height: 5, width: 0 },
      marginBottom: '37.5%'
    },
    buttonText: {
      color: 'white',
      fontSize: 36,
      fontFamily: 'PixelOperator-Bold'
    },
    changePhoto: {
      fontSize: 18,
      fontFamily: 'SairaRegular',
      textDecorationLine: 'underline',
      color: 'white',
      alignSelf: 'center',
      marginTop: 5
    }
  });