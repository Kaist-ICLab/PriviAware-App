import {apiRequest} from './apiRequest';

export const setFilteringStatus = async (email, newStatus) => {
  return await apiRequest({email: email, newStatus: newStatus}, '/setstatus');
};

export const getFilteringStatus = async email => {
  return await apiRequest({email: email}, '/status');
};
