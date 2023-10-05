import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {getStorage, removeStorage, setStorage} from '@utils/asyncStorage';
import {ALERTBOX_MSG} from '@constants/Messages';
import {signIn} from '@apis';
import {alertError} from '@utils/alert';

export const useLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailValidity, setEmailValidity] = useState(false);
  const [password, setPassword] = useState('');
  const [showPW, setShowPW] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const handleEmail = value => {
    if (value.includes('@')) {
      setEmailValidity(true);
    } else {
      setEmailValidity(false);
    }
    setEmail(value);
  };

  const handleCheckbox = value => {
    if (value) {
      setStorage('autoLogin', true);
    } else {
      removeStorage('autoLogin');
    }
    setToggleCheckBox(value);
  };

  const handlePassword = value => {
    setPassword(value);
  };

  const handleShowPW = () => {
    setShowPW(!showPW);
  };

  useEffect(() => {
    getStorage('userEmail').then(userEmail => {
      if (userEmail) {
        getStorage('autoLogin').then(isLoggedIn => {
          if (isLoggedIn) {
            setEmail(() => userEmail);
            handleEmail(userEmail);
            setToggleCheckBox(() => true);
          }
        });
      }
    });
  }, []);

  const login = async () => {
    if (!emailValidity) {
      alertError(ALERTBOX_MSG.INVALID_EMAIL);
      return;
    }
    if (password.length === 0) {
      alertError(ALERTBOX_MSG.EMPTY_PASSWORD);
      return;
    }
    setLoading(true);

    try {
      const data = await signIn(email, password);
      setLoading(false);

      if (!data.result) {
        alertError(ALERTBOX_MSG.WRONG_INFORMATION);
        return;
      }
      setStorage('userEmail', email);
      navigation.navigate('Overview', {email: email});
    } catch (e) {
      setLoading(false);
      alertError(ALERTBOX_MSG.SIGN_IN_FAILED);
    }
  };

  const register = () => {
    navigation.navigate('Register');
  };

  return {
    register,
    login,
    handleEmail,
    email,
    emailValidity,
    handlePassword,
    handleShowPW,
    showPW,
    handleCheckbox,
    toggleCheckBox,
    loading,
  };
};
