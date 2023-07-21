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

// date object to time string ex) 23:00
const dateToTimeString = date => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
};

const convertUTCToLocalDate = date => {
  if (!date) {
    return date;
  }

  const convertedDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );

  return convertedDate;
};

const convertLocalToUTCDate = date => {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
  return date;
};

const dateToTimestamp = date => {
  return date.getTime();
};

export {
  timestampToHoursConverter,
  dateToString,
  dateToTimeString,
  convertUTCToLocalDate,
  convertLocalToUTCDate,
  dateToTimestamp,
};
