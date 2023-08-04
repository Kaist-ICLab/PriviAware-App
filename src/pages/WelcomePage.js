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
    navigation.replace('Login');
  };

  const signUp = () => {
    navigation.replace('Register');
  };

  return (
    <LinearGradient
      colors={['#5A5492', '#863B8E']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={styles.innerContainer}>
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
    justifyContent: 'center',
  },
  innerContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  description: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F2C2B6',
    fontSize: 16,
    paddingHorizontal: '20%',
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
  textContainer: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: '10%',
    justifyContent: 'space-around',
  },
});
