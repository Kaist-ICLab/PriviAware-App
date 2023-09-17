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
