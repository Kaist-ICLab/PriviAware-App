import React, {useEffect, useState} from 'react';
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
import {getStorage, removeStorage, setStorage} from '../utils/asyncStorage';
import CheckBox from '@react-native-community/checkbox';
import {colorSet} from '../constants/Colors';
import {signIn} from '../apis';

export default function LoginPage() {
  const {colors} = useTheme();

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailValidity, setEmailValidity] = useState(false);
  const [password, setPassword] = useState('');
  const [showPW, setShowPW] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleEmail = value => {
    if (value.includes('@')) setEmailValidity(true);
    else setEmailValidity(false);
    setEmail(value);
  };

  const handleCheckbox = value => {
    if (value) {
      setStorage('autoLogin', true);
    } else {
      removeStorage('autoLogin');
    }
    setToggleCheckBox(value);
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

  useEffect(() => {
    getStorage('userEmail').then(userEmail => {
      if (userEmail) {
        getStorage('autoLogin').then(isLoggedIn => {
          if (isLoggedIn) {
            setEmail(() => userEmail);
            handleEmail(userEmail);
            setToggleCheckBox(() => true);
          }
        });
      }
    });
  }, []);

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

    const data = await signIn(email, password);

    console.log('[RN App.js] Received: ' + JSON.stringify(data));
    setLoading(false);
    if (!data.result) AlertBox('Error', 'Incorrect email or password');
    else {
      setStorage('userEmail', email);
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
        ...styles.container,
      }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
      </View>
      <View stype={styles.formContainer}>
        <Text
          style={{
            marginTop: 10,
            fontSize: 17,
          }}>
          Gmail
        </Text>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            onChangeText={handleEmail}
            value={email}
            placeholder="example@gmail.com"
            placeholderTextColor="#AEAEAE"
          />
        </View>

        {emailValidity ? (
          <></>
        ) : (
          <Text style={{color: '#ff0000'}}>Invalid Email</Text>
        )}
        <Text
          style={{
            marginTop: 10,
            fontSize: 17,
          }}>
          Password
        </Text>
        <View style={styles.textInputWrapper}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{...styles.textInput, width: '88%'}}
              secureTextEntry={!showPW}
              onChangeText={value => handlePassword(value)}
            />
            <TouchableOpacity onPress={handleShowPW}>
              <Entypo
                name={showPW ? 'eye-with-line' : 'eye'}
                size={20}
                color="#AEAEAE"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={handleCheckbox}
          tintColors={{true: colorSet.primary}}
        />
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.8}
          onPress={() => handleCheckbox(!toggleCheckBox)}>
          <Text style={styles.rememberIdText}> Remember ID </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
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
    color: '#000000',
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
  row: {flexDirection: 'row'},
  textInputTitle: {
    marginTop: 10,
    fontSize: 17,
  },
  rememberIdText: {
    textAlignVertical: 'center',
  },
});
