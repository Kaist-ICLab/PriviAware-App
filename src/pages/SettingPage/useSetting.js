import {useState, useEffect} from 'react';
import {ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';

import {
  deleteFilteringList,
  getData,
  getFilteringList,
  setFilteringList,
  setFilteringStatus,
  updateFilteringList,
} from '@apis';
import {DATATYPE_DESCRIPTION} from '@constants/DataTypeDescription';
import {
  dateToTimestamp,
  dateToTimestampWithoutDate,
  convertUpperCaseWithBlank,
  convertDataType,
} from '@utils/common';
import {AlertBox, alertError} from '@utils/alert';

export const useSetting = (email, dt, savedStatus) => {
  const today = new Date();

  const startToday = dayjs(today).startOf('day');
  const endToday = dayjs(today).endOf('day');

  const navigation = useNavigation();
  const [status, setStatus] = useState(savedStatus);
  // toggle related
  const [toggleStatus, setToggleStatus] = useState(savedStatus !== 'off');

  const [filterInfo, setFilterInfo] = useState([]);

  // data visualization related
  const [timeRange, setTimeRange] = useState([
    new Date(startToday),
    new Date(endToday),
  ]);

  const [date, setDate] = useState(new Date(startToday));

  const [dataField, setDataField] = useState('');
  const [zeroFlag, setZeroFlag] = useState(false);
  // data record related
  const [data, setData] = useState([]);

  const validateTimeRange = (startDate, endDate) => {
    if (startDate.getTime() > endDate.getTime()) {
      alertError('Starting time cannot be later than ending time');
      return false;
    }
    return true;
  };

  const fetchFilteringSetting = async () => {
    const data = await getFilteringList(email);
    const filterList = data.filtering[dt.name];

    if (filterList.length > 0 && toggleStatus) {
      updateToDB({
        ['status.' + dt.name]: 'filter',
        ['offTS.' + dt.name]: 0,
      });
    } else if (filterList.length === 0 && toggleStatus) {
      updateToDB({
        ['status.' + dt.name]: 'on',
        ['offTS.' + dt.name]: 0,
      });
    }

    setFilterInfo(() => filterList);
  };

  useEffect(() => {
    if (dt.name) {
      fetchFilteringSetting();
    }
  }, [savedStatus, email, dt]);

  useEffect(() => {
    if (dt.field) {
      setDataField(dt.field[0]);
    }
  }, [dt]);

  useEffect(() => {
    /**
     * Fetch collected data from DB
     */
    const fetchDataFromDB = async () => {
      if (email && dt.name && date && timeRange) {
        const startDate = new Date(dayjs(date).startOf('day'));

        const timeRangetoTimestamp = [
          dateToTimestampWithoutDate(timeRange[0]),
          dateToTimestampWithoutDate(timeRange[1]),
        ];

        const data = await getData(
          email,
          dt.name,
          dateToTimestamp(startDate),
          timeRangetoTimestamp,
        );

        if (data.res.length === 0) setZeroFlag(true);
        else setZeroFlag(false);
        setData(data.res);
      }
    };

    fetchDataFromDB();
  }, [email, dt.name, date, timeRange]);

  const updateToDB = async newStatus => {
    const data = await setFilteringStatus(email, newStatus);
    if (!data.result) alertError('Error in updating setting');
  };

  const addFilteringDB = async (dataType, condition) => {
    const data = await setFilteringList(email, dataType, condition);

    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('A filter was successfully added!', ToastAndroid.SHORT);
    } else {
      alertError('Error in appending filtering');
    }
  };

  const updateFilteringDB = async (
    dataType,
    originalCondition,
    newCondition,
  ) => {
    const data = updateFilteringList(
      email,
      dataType,
      originalCondition,
      newCondition,
    );
    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('saved', ToastAndroid.SHORT);
    } else {
      alertError('Error in updating filtering');
    }
  };

  const deleteFilteringDB = async (dataType, condition) => {
    const data = await deleteFilteringList(email, dataType, condition);

    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('A filter was deleted', ToastAndroid.SHORT);
    } else {
      alertError('Error in deleting filtering');
    }
  };

  const showInfo = () => {
    const name = convertUpperCaseWithBlank(dt.name);
    AlertBox(name, DATATYPE_DESCRIPTION[dt.name].description);
  };

  const handleToggleStatus = () => {
    if (status === 'off') {
      setStatus('on');
      setToggleStatus(true);
      if (filterInfo.length > 0) {
        updateToDB({
          ['status.' + dt.name]: 'filter',
          ['offTS.' + dt.name]: 0,
        });
      } else {
        updateToDB({
          ['status.' + dt.name]: 'on',
          ['offTS.' + dt.name]: 0,
        });
      }
    } else {
      const currentTimeStamp = dateToTimestamp(new Date());
      setStatus('off');
      setToggleStatus(false);
      updateToDB({
        ['status.' + dt.name]: 'off',
        ['offTS.' + dt.name]: currentTimeStamp,
      });
    }
  };

  // Change date1's hour, minute, second to date2's
  const changeDate = (date1, date2) => {
    const newDate = new Date(date1);
    newDate.setHours(date2.getHours());
    newDate.setMinutes(date2.getMinutes());
    newDate.setSeconds(date2.getSeconds());
    return newDate;
  };

  const handleDate = value => {
    setDate(value);
    setTimeRange(prev => [
      changeDate(value, prev[0]),
      changeDate(value, prev[1]),
    ]);
  };

  /**
   * Handle time range change
   * index is 0 or 1
   * 0 for starting time, 1 for ending time
   */
  const handleTimeRange = (value, index) => {
    if (index === 0) {
      if (validateTimeRange(value, timeRange[1])) {
        setTimeRange(prev => [value, prev[1]]);
      }
    } else {
      if (validateTimeRange(timeRange[0], value)) {
        setTimeRange(prev => [prev[0], value]);
      }
    }
  };

  const back = () => {
    navigation.navigate('Overview', {email: email});
  };

  const dataType = dt.name ? convertDataType(dt.name) : '';

  return {
    status,
    toggleStatus,
    filterInfo,
    timeRange,
    date,
    dataField,
    setDataField,
    zeroFlag,
    data,
    showInfo,
    handleToggleStatus,
    handleDate,
    handleTimeRange,
    back,
    addFilteringDB,
    updateFilteringDB,
    deleteFilteringDB,
    setToggleStatus,
    dataType,
  };
};
