import {ALERTBOX_MSG} from '@constants/Messages';
import {Alert} from 'react-native';
import RNExitApp from 'react-native-exit-app';

export const AlertBox = (title, msg) => {
  Alert.alert(title, msg, [
    {
      text: 'OK',
      style: 'cancel',
    },
  ]);
};

export const PermissionAlertBox = (title, msg) => {
  Alert.alert(title, msg, [
    {
      text: 'OK',
      onPress: RNExitApp.exitApp,
    },
  ]);
};

export const alertError = errorMessage => {
  AlertBox(ALERTBOX_MSG.ERROR, errorMessage);
  return;
};

export const alertSuccess = successMessage => {
  AlertBox(ALERTBOX_MSG.SUCCESS, successMessage);
  return;
};
