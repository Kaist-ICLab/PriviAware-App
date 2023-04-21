/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, PermissionsAndroid, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNExitApp from 'react-native-exit-app';

import LoginPage from './src/Component/LoginPage';
import RegisterPage from './src/Component/RegisterPage';
import OverviewPage from './src/Component/OverviewPage';
import SettingPage from './src/Component/SettingPage';

function App() {
  const PermissionAlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: "OK", onPress: RNExitApp.exitApp
      }
    ]);
  };

  const requestLocationPermission = async () => {
    try {
      const perm = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
      if (perm) return true;
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const loginAction = async () => {
      const temp = await requestLocationPermission();
      if (!temp)
        PermissionAlertBox("Warning", "Functions in this application require your location data. Some of the functions might not be accessble if you do not provide location data to this application.\n*You can always update this permission in Setting (Allow all the time).");
    };
    loginAction();
  }, []);

  const Stack = createStackNavigator();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Overview" component={OverviewPage} />
          <Stack.Screen name="Setting" component={SettingPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;