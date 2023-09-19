/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import OverviewPage from './src/pages/OverviewPage/OverviewPage';
import SettingPage from './src/pages/SettingPage/SettingPage';
import {LightTheme, DarkTheme} from './src/constants/Colors';
import WelcomePage from './src/pages/WelcomePage';
import {LoginPage} from './src/pages/LoginPage';
import {RegisterPage} from './src/pages/RegisterPage';
import {PERMISSION_MSG} from './src/constants/Messages';
import {PermissionAlertBox} from './src/utils/alert';

function App() {
  const requestLocationPermission = async () => {
    try {
      const perm = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
      if (perm) return true;
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
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
      if (!temp) {
        PermissionAlertBox(
          PERMISSION_MSG.WARNING,
          PERMISSION_MSG.WARN_LOCATION_PERMISSION,
        );
      }
    };
    loginAction();
  }, []);

  const Stack = createStackNavigator();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDarkMode ? DarkTheme : LightTheme}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Welcome" component={WelcomePage} />
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
