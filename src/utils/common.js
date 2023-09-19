import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/** get rid of underscore and change first character to upper case
@example example_name to Example name
*/
const convertUpperCaseWithBlank = str => {
  return `${str.charAt(0).toUpperCase() + str.slice(1).replaceAll('_', ' ')}`;
};

const timestampToHoursConverter = ts => {
  const date = new Date(ts);
  return (
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0')
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

const dateToTimestamp = date => {
  return date.getTime();
};

/**
 * only return timestamp contain hour, minute, second information
 */
const dateToTimestampWithoutDate = date => {
  const dateTimeStamp = date.getTime();
  const dateStart = new Date(dayjs(date).startOf('day'));
  return dateTimeStamp - dateStart.getTime();
};

/**
 * if the number is too large, convert it to a short string with a unit(k, m)
 */
const formatNumber = num => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const convertDataType = dataType =>
  dataType.charAt(0).toUpperCase() + dataType.slice(1).replaceAll('_', ' ');

/**
 * convert timestamp to hours with unit, ex) 12am, 1pm, 12nn, 0mn
 */
const timestampToHoursWithUnitConverter = ts => {
  const date = new Date(ts);
  const hour = date.getUTCHours();
  if (hour === 0) return String(date.getUTCHours()) + 'MN';
  if (hour > 0 && hour < 12) return String(date.getUTCHours()) + 'AM';
  if (hour === 12) return String(date.getUTCHours()) + 'NN';
  if (hour > 12) return String(date.getUTCHours() - 12) + 'PM';
};

const timestampToFullHoursConverter = ts => {
  const date = new Date(ts);
  return (
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0') +
    '.' +
    String(date.getMilliseconds()).padStart(3, '0')
  );
};

export {
  timestampToHoursConverter,
  timestampToHoursWithUnitConverter,
  timestampToFullHoursConverter,
  dateToTimestampWithoutDate,
  dateToString,
  dateToTimeString,
  dateToTimestamp,
  formatNumber,
  convertDataType,
  convertUpperCaseWithBlank,
};
