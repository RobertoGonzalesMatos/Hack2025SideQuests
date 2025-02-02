import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./_layout";
import { ImageBackground } from "expo-image";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/createprofile"); // Redirect to the home screen after login
    } catch (error) {
      Alert.alert("Error: " + error);
    }
  };

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false); 

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackground  
        source={require('../assets/images/onboardingbg.png')} 
        style={styles.image}>
            <View style={styles.textContainer}>
            <ImageBackground
            source={email || emailFocused ? require('../assets/images/textinput.png') : require('../assets/images/emailinput.png')}
            style={styles.textInputBackground}>
              <TextInput
                style={[styles.emailInput, {backgroundColor: emailFocused ? '#FFFFFF' : 'transparent'}]}
                placeholder= ''
                placeholderTextColor={"#CACACA"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </ImageBackground>
            <ImageBackground
            source={password || passwordFocused ? require('../assets/images/textinput.png') : require('../assets/images/passwordinput.png')}
            style={styles.textInputBackground}>
              <TextInput
                style={[styles.passwordInput, {backgroundColor: passwordFocused ? '#FFFFFF' : 'transparent'}]}
                placeholder=''
                placeholderTextColor={"#CACACA"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </ImageBackground>
            </View>
          <TouchableOpacity style={styles.startButton} onPress={handleLogin}>
                      <Text style={styles.startButtonText}>press start</Text>
                    </TouchableOpacity>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  emailInput: {
    width: '88%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'SairaRegular',
    fontSize: 24,
    marginTop: 10,
  },
  passwordInput: {
    width: '88%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'SairaRegular',
    fontSize: 24,
    marginTop: 13,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginTop: '30%'
  },
  textInputBackground:{
    width: '90%',      
    height: 60,     
    alignSelf: 'center',
    alignItems: 'center', 
    overflow: 'hidden',
    marginTop: '5%'
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
});
