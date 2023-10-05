import Config from 'react-native-config';

const HEADER = {'Content-Type': 'application/json'};
const POST = 'POST';
const SERVER_IP_ADDR = Config.SERVER_IP_ADDR;

/** now, all of api's method is POST. for further using, you may have to give options for other methods*/
const apiPayload = body => {
  return {
    method: POST,
    headers: HEADER,
    body: JSON.stringify(body),
  };
};

export const apiRequest = async (body, path) => {
  const payload = apiPayload(body);
  const res = await fetch(`${SERVER_IP_ADDR}${path}`, payload);

  return await res.json();
};
