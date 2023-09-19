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
import Config from 'react-native-config';

import {SENSITIVE_DATATYPE, NORMAL_DATATYPE} from '@constants/DataType';
import {DATATYPE_DESCRIPTION} from '@constants/DataTypeDescription';
import {globalStyles} from '@styles/global';
import {removeStorage} from '@utils/asyncStorage';
import {getFilteringStatus} from '@apis';

const SERVER_IP_ADDR = Config.SERVER_IP_ADDR;

const collectionStatus = {
  ON: '#5A5492',
  OFF: '#D9D9D9',
};

export default function OverviewPage({route}) {
  const {colors} = useTheme();

  const {email} = route.params;
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
              console.log(
                'longitude:',
                pos.coords.longitude,
                'latitude:',
                pos.coords.latitude,
              );
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
              console.log(
                JSON.stringify({
                  email: email,
                  locationRecord: {
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude,
                    timestamp: Date.now(),
                  },
                }),
              );
            } catch (err) {
              console.log('err occured', err);
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
    const data = await getFilteringStatus(email);
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
    removeStorage('userEmail');
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
              <View style={styles.dotContainer}>
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'off'
                        ? collectionStatus.OFF
                        : collectionStatus.ON,
                  }}
                />
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'filter'
                        ? collectionStatus.ON
                        : collectionStatus.OFF,
                  }}
                />
              </View>
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

              <View style={styles.dotContainer}>
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'off'
                        ? collectionStatus.OFF
                        : collectionStatus.ON,
                  }}
                />
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'filter'
                        ? collectionStatus.ON
                        : collectionStatus.OFF,
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.extraInformation}>
          <View style={styles.dotContainer}>
            <View
              style={{
                ...styles.largeDotStatus,
                backgroundColor: collectionStatus.ON,
              }}>
              <Text style={[{color: '#ffffff'}, styles.statusText]}>ON</Text>
            </View>
            <View
              style={{
                ...styles.largeDotStatus,
                backgroundColor: collectionStatus.OFF,
              }}>
              <Text style={[{color: '#000000'}, styles.statusText]}>OFF</Text>
            </View>
          </View>
          <View>
            <Text styles={styles.row}>
              left circle - data collection status
            </Text>
            <Text styles={styles.row}>right circle - filtering status</Text>
          </View>
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
    marginRight: 8,
  },
  largeDotStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
  },
  loginInfo: {fontSize: 15, color: '#000000'},
  row: {flexDirection: 'row'},
  extraInformation: {marginTop: 10, flexDirection: 'row'},
});