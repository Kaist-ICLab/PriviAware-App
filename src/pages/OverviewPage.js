import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useTheme} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import RNExitApp from 'react-native-exit-app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SENSITIVE_DATATYPE, NORMAL_DATATYPE} from '../constants/Constant';
import {DATATYPE_DESCRIPTION} from '../constants/DataTypeDescription';
import {SERVER_IP_ADDR, SERVER_PORT} from '@env';
import {globalStyles} from '../styles/global';

const collectionStatus = {
  FILTERING: '#5A5492',
  ON: '#ACA9C8',
  OFF: '#D9D9D9',
};

export default function OverviewPage({route}) {
  const {colors} = useTheme();

  // const {email} = route.params;
  const email = 'test@test.com';
  const navigation = useNavigation();
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const PermissionAlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        onPress: RNExitApp.exitApp,
      },
    ]);
  };

  useEffect(() => {
    const getInitGPSPermission = async () => {
      const res = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
      if (res) {
        BackgroundTimer.runBackgroundTimer(() => {
          Geolocation.getCurrentPosition(pos => {
            try {
              fetch(SERVER_IP_ADDR + '/locationrecord', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  locationRecord: {
                    email: email,
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude,
                    timestamp: Date.now(),
                  },
                }),
              });
            } catch (err) {
              console.log(err);
            }
          });
        }, 600000);
      } else {
        PermissionAlertBox(
          'Warning',
          'Functions in this application require your location data. Some of the functions might not be accessble if you do not provide location data to this application.\n*You can always update this permission in Setting (Allow all the time).',
        );
      }
    };
    getInitGPSPermission();
  }, []);

  const getStatus = async () => {
    setLoading(true);
    const res = await fetch(SERVER_IP_ADDR + '/status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email}),
    });
    const data = await res.json();
    console.log('[RN OverviewPage.js] Received: ' + JSON.stringify(data));
    setStatus(data);
  };

  useEffect(() => {
    setLoading(false);
  }, [status]);

  // run once this page is loaded
  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getStatus();
    });
    return focusHandler;
  }, [navigation]);

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const navToSetting = dt => {
    navigation.navigate('Setting', {
      dt: dt,
      status: status[dt.name],
      email: email,
    });
  };

  const showInfo = dt => {
    const name =
      dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll('_', ' ');
    AlertBox(name, DATATYPE_DESCRIPTION[dt.name].description);
  };

  const logoutAction = () => {
    navigation.navigate('Login');
    BackgroundTimer.stopBackgroundTimer();
  };

  const logout = () => {
    Alert.alert(
      'Warning',
      'Logging out will stop the location detecting in this application.\nLocation filtering setting might not be working as expected.\nAre you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: logoutAction,
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <View style={{opacity: loading ? 0.3 : 1, flex: 1}}>
        <Text style={globalStyles.header}>Data Types</Text>
        <Text style={styles.loginInfo}>Logged in as: {email}</Text>

        <ScrollView>
          <Text style={styles.listTitle}>Sensitive</Text>
          {SENSITIVE_DATATYPE.map((dt, i) => (
            <View key={i} style={styles.listContent}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name={dt.icon}
                  size={20}
                  style={styles.icon}
                />
                <TouchableOpacity
                  style={{marginEnd: 10, marginVertical: 13}}
                  onPress={() => navToSetting(dt)}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {dt.name.charAt(0).toUpperCase() +
                      dt.name.slice(1).replaceAll('_', ' ')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => showInfo(dt)}>
                  <AntDesign name="questioncircleo" size={15} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  ...styles.dotStatus,
                  backgroundColor:
                    status[dt.name] === 'on'
                      ? collectionStatus.ON
                      : status[dt.name] === 'off'
                      ? collectionStatus.OFF
                      : collectionStatus.FILTERING,
                }}
              />
            </View>
          ))}
          <Text style={styles.listTitle}>Not Sensitive</Text>
          {NORMAL_DATATYPE.map((dt, i) => (
            <View key={i} style={styles.listContent}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name={dt.icon}
                  size={20}
                  style={styles.icon}
                />
                <TouchableOpacity
                  style={{marginEnd: 10, marginVertical: 13}}
                  onPress={() => navToSetting(dt)}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {dt.name.charAt(0).toUpperCase() +
                      dt.name.slice(1).replaceAll('_', ' ')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => showInfo(dt)}>
                  <AntDesign name="questioncircleo" size={15} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  ...styles.dotStatus,
                  backgroundColor:
                    status[dt.name] === 'on'
                      ? collectionStatus.ON
                      : status[dt.name] === 'off'
                      ? collectionStatus.OFF
                      : collectionStatus.FILTERING,
                }}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.extraInformation}>
          {Object.keys(collectionStatus).map(s => (
            <View style={styles.row} key={s}>
              <View
                style={{
                  ...styles.dotStatus,
                  backgroundColor: collectionStatus[s],
                }}
              />
              <Text>
                {s === 'FILTERING'
                  ? `Data Collection ON / Filtering ON`
                  : `Data Collection ${s} / Filtering OFF`}
              </Text>
            </View>
          ))}
        </View>
        <View style={{marginTop: 20, marginBottom: 20, alignSelf: 'center'}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: '#F3F2F2',
            }}
            onPress={logout}>
            <Text style={{color: '#000000'}}>Logout</Text>
          </TouchableOpacity>
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
  listTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 5,
  },
  listContent: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {marginHorizontal: 4, marginVertical: 13},
  dotStatus: {
    width: 16,
    height: 16,
    borderRadius: 9,
    alignSelf: 'center',
    marginRight: 20,
  },
  loginInfo: {fontSize: 15, color: '#000000'},
  row: {flexDirection: 'row'},
  extraInformation: {marginTop: 10},
});
