/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Button } from 'react-native';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions, } from 'react-native/Libraries/NewAppScreen';
import DeviceInfo from 'react-native-device-info';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BackgroundTimer from 'react-native-background-timer';

import { SERVER_IP_ADDR, SERVER_PORT } from '@env';
import LoginPage from './src/Component/LoginPage';
import RegisterPage from './src/Component/RegisterPage';
import OverviewPage from './src/Component/OverviewPage';
import SettingPage from './src/Component/SettingPage';

const dataQueryFunc = async () => {
  console.log("[RN App.js] dataQueryFunc started");
  const deviceModel = DeviceInfo.getModel();
  const queryFilter = { "subject.deviceModel": deviceModel, "subject.email": "emily@kse.kaist.ac.kr", "datumType": "EMBEDDED_SENSOR" };
  const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/data", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryFilter: queryFilter })
  });
  const data = await res.json();
  console.log("[RN App.js] Received: " + JSON.stringify(data));
};

const dataDeleteFunc = async () => {
  console.log("[RN App.js] dataDeleteFunc started");
  const deviceModel = DeviceInfo.getModel();
  const queryFilter = { "subject.deviceModel": deviceModel, "subject.email": "emily@kse.kaist.ac.kr", "datumType": "EMBEDDED_SENSOR" };
  const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/deletedata", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryFilter: queryFilter })
  });
  const data = await res.json();
  console.log("[RN App.js] Received: " + JSON.stringify(data));
}

const Section = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

function App() {
  const Stack = createStackNavigator();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //     backgroundColor={backgroundStyle.backgroundColor}
    //   />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <View
    //       style={{
    //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
    //       }}>
    //       <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.js</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <View style={{ margin: 10 }}>
    //         <Button
    //           onPress={dataQueryFunc}
    //           title="Query Data"
    //         />
    //       </View>
    //       <View style={{ margin: 10 }}>
    //         <Button
    //           onPress={dataDeleteFunc}
    //           title="Delete Data"
    //         />
    //       </View>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>

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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
