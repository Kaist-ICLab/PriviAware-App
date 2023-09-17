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
import {useRegister} from './useRegister';

export function RegisterPage() {
  const {colors} = useTheme();
  const {
    showPW1,
    showPW2,
    emailValidity,
    loading,
    handleEmail,
    handlePassword1,
    handlePassword2,
    handleShowPW1,
    handleShowPW2,
    cancel,
    submit,
  } = useRegister();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.background,
      opacity: loading ? 0.3 : 1,
    },
  ];
  return (
    <SafeAreaView style={containerStyle}>
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
            placeholder="example@gmail.com"
            placeholderTextColor="#AEAEAE"
          />
        </View>

        {emailValidity ? (
          <></>
        ) : (
          <Text style={styles.invalidText}>Invalid Email</Text>
        )}
        <Text style={styles.textInputTitle}>Password</Text>

        <View style={styles.textInputWrapper}>
          <View style={styles.centeredRow}>
            <TextInput
              style={{...styles.textInput, width: '88%'}}
              secureTextEntry={!showPW1}
              onChangeText={value => handlePassword1(value)}
            />
            <TouchableOpacity onPress={handleShowPW1}>
              <Entypo
                name={showPW1 ? 'eye-with-line' : 'eye'}
                size={20}
                color="#AEAEAE"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.textInputTitle}>Confirm Password</Text>

        <View style={styles.textInputWrapper}>
          <View style={styles.centeredRow}>
            <TextInput
              style={{...styles.textInput, width: '88%'}}
              secureTextEntry={!showPW2}
              onChangeText={value => handlePassword2(value)}
            />
            <TouchableOpacity onPress={handleShowPW2}>
              <Entypo
                name={showPW2 ? 'eye-with-line' : 'eye'}
                size={20}
                color="#AEAEAE"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}> Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInGuideText} onPress={cancel}>
          <Text> Already have an account?</Text>
          <Text style={styles.signUp}> Sign In</Text>
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
  textInputTitle: {
    marginTop: 10,
    fontSize: 17,
  },
  signInGuideText: {
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
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
