import {useState} from 'react';
import {Keyboard, Alert} from 'react-native';
import {dateToTimestamp} from '../utils';

const INITIAL_COORDINATE = {
  latitude: 36.374228,
  longitude: 127.365861,
};

const INITIAL_COORDINATE_DELTA = {
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0122,
};

/**
 * a custom hook for filteringInfo component
 */
const useFilter = (
  setToggleStatus,
  updateToDB,
  addFiltering,
  updateFiltering,
  deleteFiltering,
  dt,
  filterStatus,
  filter,
) => {
  const [status, setStatus] = useState(filterStatus);

  let [isLocationOn, isTimeOn] =
    filter !== undefined
      ? [filter.type.indexOf('L') !== -1, filter.type.indexOf('T') !== -1]
      : [false, false];

  const [timeToggleStatus, setTimeToggleStatus] = useState(isTimeOn);
  const [locationToggleStatus, setLocationToggleStatus] =
    useState(isLocationOn);

  // time setting related
  const [showTimeSetting, setShowTimeSetting] = useState(isTimeOn);
  const {startingTime, endingTime} = isTimeOn ? filter : {};
  const {
    radius: rad,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  } = isLocationOn ? filter : {};

  const [timePicker1, setTimePicker1] = useState(new Date(startingTime));
  const [timePicker2, setTimePicker2] = useState(new Date(endingTime));

  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  // location setting related
  const [showLocationSetting, setShowLocationSetting] = useState(isLocationOn);
  const [dragging, setDragging] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(
    isLocationOn ? {latitude, longitude} : INITIAL_COORDINATE,
  );
  const [pickedLocationDelta, setPickedLocationDelta] = useState(
    isLocationOn ? {latitudeDelta, longitudeDelta} : INITIAL_COORDINATE_DELTA,
  );
  const [radius, setRadius] = useState(rad);

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const handleTimeToggleStatus = () => {
    if (timeToggleStatus) {
      setStatus('on');
      setToggleStatus(true);
      setShowTimeSetting(false);
      updateToDB({
        ['status.' + dt.name]: 'on',
        ['timeFiltering.' + dt.name]: {},
      });
    } else {
      // Show time setting for user
      setShowTimeSetting(true);
    }
    setTimeToggleStatus(!timeToggleStatus);
  };

  const handleShowTimePicker1 = () => {
    setShowTimePicker1(!showTimePicker1);
  };

  const validateTimeRange = (startDate, endDate) => {
    if (startDate.getTime() > endDate.getTime()) {
      AlertBox('Error', 'Starting time cannot be later than ending time');
      return false;
    }
    return true;
  };

  const handleTimePicker1Confirm = date => {
    if (validateTimeRange(date, timePicker2)) {
      setTimePicker1(date);
      handleShowTimePicker1();
    }
  };

  const handleShowTimePicker2 = () => {
    setShowTimePicker2(!showTimePicker2);
  };

  const handleTimePicker2Confirm = date => {
    if (validateTimeRange(timePicker1, date)) {
      setTimePicker2(date);
      handleShowTimePicker2();
    }
  };

  const validateTimeSetting = () => {
    // reject all impossible cases
    if (!timePicker1 || !timePicker2) {
      AlertBox('Error', 'Please enter both starting time and ending time');
      setShowTimeSetting(false);
      setTimeToggleStatus(false);
      return false;
    }
    if (timePicker1.getTime() > timePicker2.getTime()) {
      AlertBox('Error', 'Starting time cannot be earlier than ending time');
      setShowTimeSetting(false);
      setTimeToggleStatus(false);
      return false;
    }
    // set status as time filtering + update to PrivacyViz-Member DB
    setStatus('time');
    setToggleStatus(true);
    return true;
  };

  const handleLocationToggleStatus = () => {
    if (locationToggleStatus) {
      setStatus('on');
      setToggleStatus(true);
      setShowLocationSetting(false);
      updateToDB({
        ['status.' + dt.name]: 'on',
        ['timeFiltering.' + dt.name]: {},
      });
    } else {
      // Show location setting for user
      setShowLocationSetting(true);
    }
    setLocationToggleStatus(!locationToggleStatus);
  };

  const handleOnPanDrag = () => {
    setDragging(true);
  };

  const handleRegionChange = region => {
    setDragging(false);
    const {latitude, longitude, latitudeDelta, longitudeDelta} = region;
    setPickedLocation({latitude, longitude});
    setPickedLocationDelta({latitudeDelta, longitudeDelta});
  };

  const handleRadius = value => {
    setRadius(value ?? 0);
  };

  const validateLocationSetting = () => {
    Keyboard.dismiss();
    // reject all impossible cases
    if (!radius || !pickedLocation || !pickedLocationDelta) {
      AlertBox('Error', 'Please enter the distance');
      setShowLocationSetting(false);
      setLocationToggleStatus(false);
      return false;
    }
    const parsed = parseInt(radius);
    if (isNaN(parsed) || parsed < 0 || parsed > 500) {
      AlertBox('Error', 'Please enter an integer between 0 and 500');
      setShowLocationSetting(false);
      setLocationToggleStatus(false);
      return false;
    }
    setStatus('location');
    setToggleStatus(true);

    return true;
  };

  const getCurrentFilter = () => {
    const isLocationValid = validateLocationSetting();
    const isTimeValid = validateTimeSetting();

    const timeInfo = {
      startingTime: dateToTimestamp(timePicker1),
      endingTime: dateToTimestamp(timePicker2),
    };

    const locationInfo = {
      radius: radius,
      longitude: pickedLocation.longitude,
      latitude: pickedLocation.latitude,
      latitudeDelta: pickedLocationDelta.latitudeDelta,
      longitudeDelta: pickedLocationDelta.longitudeDelta,
    };

    const timeStamp = Date.now();

    if (isLocationValid && isTimeValid) {
      return {
        ['type']: 'LT',
        ...timeInfo,
        ...locationInfo,
        ['applyTS']: timeStamp,
      };
    } else if (isLocationValid && !isTimeValid) {
      return {
        ['type']: 'L',
        ...locationInfo,
        ['applyTS']: timeStamp,
      };
    } else if (!isLocationValid && isTimeValid) {
      return {
        ['type']: 'T',
        ...timeInfo,
        ['applyTS']: timeStamp,
      };
    }

    return null;
  };

  const addFilter = () => {
    const currentFilter = getCurrentFilter();

    if (currentFilter !== null) {
      addFiltering(dt.name, currentFilter);
    }
  };

  const editFilter = () => {
    const currentFilter = getCurrentFilter();

    if (currentFilter !== null) {
      updateFiltering(dt.name, filter, currentFilter);
    }
  };

  const deleteFilter = () => {
    deleteFiltering(dt.name, filter);
  };

  const handleFilterOptions = {
    handleShowTimePicker1,
    handleShowTimePicker2,
    handleTimeToggleStatus,
    handleTimePicker1Confirm,
    handleTimePicker2Confirm,
    handleLocationToggleStatus,
    handleOnPanDrag,
    handleRegionChange,
    handleRadius,
    addFilter,
    editFilter,
    deleteFilter,
  };

  const filterValues = {
    timeToggleStatus,
    showTimeSetting,
    timePicker1,
    timePicker2,
    showTimePicker1,
    showTimePicker2,
    showLocationSetting,
    locationToggleStatus,
    pickedLocation,
    pickedLocationDelta,
    radius,
    dragging,
  };

  return {handleFilterOptions, filterValues};
};

export default useFilter;
