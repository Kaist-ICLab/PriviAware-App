import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useTheme} from '@react-navigation/native';

import {SERVER_IP_ADDR, SERVER_PORT} from '@env';

export default function LoginPage() {
  const {colors} = useTheme();

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailValidity, setEmailValidity] = useState(false);
  const [password, setPassword] = useState('');
  const [showPW, setShowPW] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmail = value => {
    if (value.includes('@')) setEmailValidity(true);
    else setEmailValidity(false);
    setEmail(value);
  };

  const handlePassword = value => {
    setPassword(value);
  };

  const handleShowPW = () => {
    setShowPW(!showPW);
  };

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const login = async () => {
    console.log('[RN LoginPage.js] Login func started');
    if (!emailValidity) {
      AlertBox('Error', 'Please enter your email correctly');
      return;
    }
    if (password.length === 0) {
      AlertBox('Error', 'Please enter your password');
      return;
    }
    setLoading(true);
    const res = await fetch(SERVER_IP_ADDR + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password}),
    });
    const data = await res.json();
    console.log('[RN App.js] Received: ' + JSON.stringify(data));
    if (!data.result) AlertBox('Error', 'Incorrect email or password');
    else {
      setLoading(false);
      navigation.navigate('Overview', {email: email});
    }
  };

  const register = () => {
    console.log('[RN LoginPage.js] Navigate to Register Page');
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{justifyContent: 'space-around', opacity: loading ? 0.3 : 1}}>
        <Text
          style={{
            alignSelf: 'center',
            color: '#000000',
            fontSize: 40,
            marginBottom: 40,
          }}>
          Sign In
        </Text>
        <View style={{marginHorizontal: 40}}>
          <Text
            style={{
              marginTop: 10,
              color: '#000000',
              fontSize: 17,
            }}>
            Gmail
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            onChangeText={value => handleEmail(value)}
          />
          {emailValidity ? (
            <></>
          ) : (
            <Text style={{color: '#ff0000'}}>Invalid Email</Text>
          )}
          <Text
            style={{
              marginTop: 10,
              color: '#000000',
              fontSize: 17,
            }}>
            Password
          </Text>
          <View
            style={{
              ...styles.textInput,
              flexDirection: 'row',
              height: 30,
              marginBottom: 20,
              backgroundColor: '#F3F2F2',
              alignItems: 'center',
            }}>
            <TextInput
              style={{paddingVertical: 0, width: '88%'}}
              secureTextEntry={!showPW}
              onChangeText={value => handlePassword(value)}
            />
            <TouchableOpacity onPress={handleShowPW}>
              {showPW ? (
                <Entypo name="eye-with-line" size={20}></Entypo>
              ) : (
                <Entypo name="eye" size={20}></Entypo>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
              }}
              onPress={register}>
              <Text> Don't have an account? </Text>
              <Text style={styles.signUp}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    display: 'flex',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#5A5492',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  signUp: {
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#F3F2F2',
    height: 30,
    paddingVertical: 0,
    borderRadius: 8,
    borderColor: '#AEAEAE33',
    borderWidth: 2,
  },
});
