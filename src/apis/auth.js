import {apiRequest} from './apiRequest';

export const signUp = (email, password1) => {
  return apiRequest({email: email, password: password1}, '/createuser');
};

export const signIn = async (email, password) => {
  return await apiRequest({email: email, password: password}, '/login');
};
