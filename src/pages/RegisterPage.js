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

import {SERVER_IP_ADDR} from '@env';

export default function RegisterPage() {
  const {colors} = useTheme();

  const navigation = useNavigation();
  const [showPW1, setShowPW1] = useState(false);
  const [showPW2, setShowPW2] = useState(false);
  const [emailValidity, setEmailValidity] = useState(false);
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = value => {
    if (value.includes('@')) setEmailValidity(true);
    else setEmailValidity(false);
    setEmail(value);
  };

  const handlePassword1 = value => {
    setPassword1(value);
  };

  const handlePassword2 = value => {
    setPassword2(value);
  };

  const handleShowPW1 = () => {
    setShowPW1(!showPW1);
  };

  const handleShowPW2 = () => {
    setShowPW2(!showPW2);
  };

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const cancel = () => {
    navigation.navigate('Login');
  };

  const submit = async () => {
    if (!emailValidity || !password1 || !password2) {
      AlertBox('Error', 'Please fill in every field correctly');
      return;
    }
    console.log(
      '[RN LoginPage.js] Email: ' +
        email +
        ' Password1: ' +
        password1 +
        ' Password2: ' +
        password2,
    );
    if (password1 !== password2) {
      AlertBox('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await fetch(SERVER_IP_ADDR + '/createuser', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password1}),
    });
    const data = await res.json();
    console.log('[RN App.js] Received: ' + JSON.stringify(data));
    if (data.result) {
      setLoading(false);
      AlertBox('Success', 'Account created!');
      navigation.navigate('Login');
    } else AlertBox('Error', 'Email is registered');
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        ...styles.container,
        opacity: loading ? 0.3 : 1,
      }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign Up</Text>
      </View>

      <View stype={styles.formContainer}>
        <Text style={styles.textInputTitle}>Gmail</Text>

        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            onChangeText={value => handleEmail(value)}
          />
        </View>

        {emailValidity ? (
          <></>
        ) : (
          <Text style={{color: '#ff0000'}}>Invalid Email</Text>
        )}
        <Text style={styles.textInputTitle}>Password</Text>

        <View style={styles.textInputWrapper}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{...styles.textInput, width: '88%'}}
              secureTextEntry={!showPW1}
              onChangeText={value => handlePassword1(value)}
            />
            <TouchableOpacity onPress={handleShowPW1}>
              {showPW1 ? (
                <Entypo name="eye-with-line" size={20}></Entypo>
              ) : (
                <Entypo name="eye" size={20}></Entypo>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.textInputTitle}>Confirm Password</Text>

        <View style={styles.textInputWrapper}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{...styles.textInput, width: '88%'}}
              secureTextEntry={!showPW2}
              onChangeText={value => handlePassword2(value)}
            />
            <TouchableOpacity onPress={handleShowPW2}>
              {showPW2 ? (
                <Entypo name="eye-with-line" size={20}></Entypo>
              ) : (
                <Entypo name="eye" size={20}></Entypo>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}> Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 10,
            justifyContent: 'center',
          }}
          onPress={cancel}>
          <Text> Already have an account?</Text>
          <Text style={styles.signUp}> Sign In</Text>
        </TouchableOpacity>
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
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 2,
  },
  buttonContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
  textInput: {
    backgroundColor: '#F3F2F2',
    height: 30,
    padding: 0,
  },
  textInputWrapper: {
    borderRadius: 8,
    borderColor: '#AEAEAE33',
    borderWidth: 2,
    backgroundColor: '#F3F2F2',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  title: {
    fontSize: 34,
  },
  textInputTitle: {
    marginTop: 10,
    fontSize: 17,
  },
});
