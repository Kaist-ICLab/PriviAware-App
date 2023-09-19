import {useState} from 'react';
import {Alert} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {signUp} from '@apis';
import {ALERTBOX_MSG} from '@constants/Messages';

export const useRegister = () => {
  const navigation = useNavigation();
  const [showPW1, setShowPW1] = useState(false);
  const [showPW2, setShowPW2] = useState(false);
  const [emailValidity, setEmailValidity] = useState(false);
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmail = value => {
    if (value.includes('@')) setEmailValidity(true);
    else setEmailValidity(false);
    setEmail(value);
  };

  const handlePassword1 = value => {
    setPassword1(value);
  };

  const handlePassword2 = value => {
    setPassword2(value);
  };

  const handleShowPW1 = () => {
    setShowPW1(!showPW1);
  };

  const handleShowPW2 = () => {
    setShowPW2(!showPW2);
  };

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const cancel = () => {
    navigation.navigate('Login');
  };

  const submit = async () => {
    if (!emailValidity || !password1 || !password2) {
      AlertBox(ALERTBOX_MSG.ERROR, ALERTBOX_MSG.EMPTY_FIELD);
      return;
    }
    if (password1 !== password2) {
      AlertBox(ALERTBOX_MSG.ERROR, ALERTBOX_MSG.WRONG_PASSWORD);
      return;
    }
    setLoading(true);

    const data = await signUp(email, password1);

    setLoading(false);
    if (data.result) {
      AlertBox(ALERTBOX_MSG.SUCCESS, ALERTBOX_MSG.SUCCESSFUL_SIGNUP);
      navigation.navigate('Login');
    } else {
      AlertBox(ALERTBOX_MSG.ERROR, ALERTBOX_MSG.DUPLICATED_EMAIL);
    }
  };

  return {
    showPW1,
    showPW2,
    emailValidity,
    loading,
    handleEmail,
    handlePassword1,
    handlePassword2,
    handleShowPW1,
    handleShowPW2,
    cancel,
    submit,
  };
};
