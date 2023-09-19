import {useState, useEffect} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';

import {DATATYPE_DESCRIPTION} from '@constants/DataTypeDescription';
import {removeStorage} from '@utils/asyncStorage';
import {getFilteringStatus, addLocationData} from '@apis';
import {PERMISSION_MSG} from '@constants/Messages';
import {PermissionAlertBox, AlertBox} from '@utils/alert';
import {convertUpperCaseWithBlank} from '@utils/common';

const ONE_MINUTE = 600000;

export const useOverview = (email = '') => {
  const navigation = useNavigation();
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInitGPSPermission();
  }, []);

  const getStatus = async () => {
    setLoading(true);
    const data = await getFilteringStatus(email);
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

  const navToSetting = dt => {
    navigation.navigate('Setting', {
      dt: dt,
      status: status[dt.name],
      email: email,
    });
  };

  const showInfo = dt => {
    const name = convertUpperCaseWithBlank(dt.name);
    AlertBox(name, DATATYPE_DESCRIPTION[dt.name].description);
  };

  const logoutAction = () => {
    removeStorage('userEmail');
    navigation.navigate('Login');
    BackgroundTimer.stopBackgroundTimer();
  };

  const logout = () => {
    Alert.alert(
      PERMISSION_MSG.WARNING,
      PERMISSION_MSG.WARN_LOGOUT_CAUSE_LOCATION_FILTER_DOES_NOT_WORK,
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

  return {
    status,
    loading,
    navToSetting,
    showInfo,
    logout,
  };
};

const getInitGPSPermission = async email => {
  const res = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  if (res) {
    BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.getCurrentPosition(pos => {
        try {
          addLocationData(email, pos);
        } catch (err) {
          console.log('error occured', err);
        }
      });
    }, ONE_MINUTE);
  } else {
    PermissionAlertBox(
      PERMISSION_MSG.WARNING,
      PERMISSION_MSG.WARN_LOCATION_PERMISSION,
    );
  }
};
