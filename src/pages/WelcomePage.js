import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

export default function WelcomePage() {
  const navigation = useNavigation();

  const signIn = () => {
    navigation.reset('Login');
  };

  const signUp = () => {
    navigation.reset('Register');
  };

  return (
    <LinearGradient
      colors={['#5A5492', '#863B8E']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView>
        <View style={styles.textContainer}>
          <Text style={styles.title}>PRIVIZ</Text>

          <Text style={styles.description}>
            Privacy Data Management with Visualization Support
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}> Sign In </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}> Sign Up </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  description: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F2C2B6',
    fontSize: 16,
    maxWidth: '80%',
  },
  button: {
    display: 'flex',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#F2C2B6CC',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 42,
  },
});
