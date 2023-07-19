const timestampToHoursConverter = ts => {
  const date = new Date(ts);
  return (
    String(date.getUTCHours()).padStart(2, '0') +
    ':' +
    String(date.getUTCMinutes()).padStart(2, '0')
  );
};

const dateToString = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};

export {timestampToHoursConverter, dateToString};
