import Config from 'react-native-config';
const SERVER_IP_ADDR = Config.SERVER_IP_ADDR;

const HEADER = {'Content-Type': 'application/json'};
const POST = 'POST';

export const setFilteringStatus = async (email, newStatus) => {
  const res = await fetch(SERVER_IP_ADDR + '/setstatus', {
    method: POST,
    headers: HEADER,
    body: JSON.stringify({email: email, newStatus: newStatus}),
  });
  const data = await res.json();
  return data;
};

export const getFilteringList = async email => {
  const res = await fetch(SERVER_IP_ADDR + '/getfiltering', {
    method: POST,
    headers: HEADER,
    body: JSON.stringify({email: email}),
  });

  const data = await res.json();
  return data;
};

export const setFilteringList = async (email, dataType, condition) => {
  const res = await fetch(SERVER_IP_ADDR + '/setfiltering', {
    method: POST,
    headers: HEADER,
    body: JSON.stringify({
      email: email,
      dt: dataType,
      condition: condition,
    }),
  });
  const data = await res.json();
  return data;
};

export const updateFilteringList = async (
  email,
  dataType,
  originalCondition,
  newCondition,
) => {
  const res = await fetch(SERVER_IP_ADDR + '/updatefiltering', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      dt: dataType,
      original: originalCondition,
      new: newCondition,
    }),
  });
  const data = await res.json();

  return data;
};

export const deleteFilteringList = async (email, dataType, condition) => {
  const res = await fetch(SERVER_IP_ADDR + '/delfiltering', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      dt: dataType,
      condition: condition,
    }),
  });
  const data = await res.json();

  return data;
};

export const getData = async (email, datatype, date, timeRange) => {
  const res = await fetch(SERVER_IP_ADDR + '/data', {
    method: POST,
    headers: HEADER,
    body: JSON.stringify({
      email: email,
      dataType: datatype,
      date: date,
      timeRange: timeRange,
    }),
  });

  const data = await res.json();
  return data;
};
