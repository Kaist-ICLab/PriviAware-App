import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTheme} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import {colorSet} from '@constants/Colors';
import {useLogin} from './useLogin';

export function LoginPage() {
  const {colors} = useTheme();
  const {
    register,
    login,
    handleEmail,
    email,
    emailValidity,
    handlePassword,
    handleShowPW,
    showPW,
    handleCheckbox,
    toggleCheckBox,
    loading,
  } = useLogin();

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
        <Text style={styles.textfieldTitle}>Gmail</Text>
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
          <Text style={styles.invalidText}>Invalid Email</Text>
        )}

        <Text style={styles.textfieldTitle}>Password</Text>
        <View style={styles.textInputWrapper}>
          <View style={styles.centeredRow}>
            <TextInput
              style={[styles.textInput, {width: '88%'}]}
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
        <TouchableOpacity style={styles.signUpGuideText} onPress={register}>
          <Text> Don't have an account? </Text>
          <Text style={styles.signUp}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
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
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputTitle: {
    marginTop: 10,
    fontSize: 17,
  },
  rememberIdText: {
    textAlignVertical: 'center',
  },
  textfieldTitle: {
    marginTop: 10,
    fontSize: 17,
  },
  signUpGuideText: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  invalidText: {color: '#ff0000'},
});
