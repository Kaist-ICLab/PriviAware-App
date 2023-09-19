import {apiRequest} from './apiRequest';

export const getData = async (email, datatype, date, timeRange) => {
  return await apiRequest(
    {
      email: email,
      dataType: datatype,
      date: date,
      timeRange: timeRange,
    },
    '/data',
  );
};

export const addLocationData = async (email, pos) => {
  return await apiRequest(
    {
      locationRecord: {
        email: email,
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
        timestamp: Date.now(),
      },
    },
    '/locationrecord',
  );
};
