import {apiRequest} from './apiRequest';

export const getFilteringList = async email => {
  return await apiRequest({email: email}, '/getfiltering');
};

export const setFilteringList = async (email, dataType, condition) => {
  return apiRequest(
    {email: email, dt: dataType, condition: condition},
    '/setfiltering',
  );
};

export const updateFilteringList = async (
  email,
  dataType,
  originalCondition,
  newCondition,
) => {
  return apiRequest(
    {
      email: email,
      dt: dataType,
      original: originalCondition,
      new: newCondition,
    },
    '/updatefiltering',
  );
};

export const deleteFilteringList = async (email, dataType, condition) => {
  return apiRequest(
    {
      email: email,
      dt: dataType,
      condition: condition,
    },
    '/delfiltering',
  );
};
