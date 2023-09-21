import {useState} from 'react';
import {Keyboard} from 'react-native';
import {alertError} from '@utils/alert';
import {FILTER_MSG} from '@constants/Messages';

const INITIAL_COORDINATE = {
  latitude: 36.374228,
  longitude: 127.365861,
};

const INITIAL_COORDINATE_DELTA = {
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0122,
};

const DEFAULT_RADIUS = '150';
/**
 * a custom hook for filteringInfo component
 */
const useFilter = (
  setToggleStatus,
  addFiltering,
  updateFiltering,
  deleteFiltering,
  dt,
  filter,
) => {
  let [isLocationOn, isTimeOn] =
    filter !== undefined
      ? [filter.type.indexOf('L') !== -1, filter.type.indexOf('T') !== -1]
      : [false, false];

  const [timeToggleStatus, setTimeToggleStatus] = useState(isTimeOn);
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
  // related to show modals
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  const [locationToggleStatus, setLocationToggleStatus] =
    useState(isLocationOn);
  const [showLocationSetting, setShowLocationSetting] = useState(isLocationOn);
  const [dragging, setDragging] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(
    isLocationOn ? {latitude, longitude} : INITIAL_COORDINATE,
  );
  const [pickedLocationDelta, setPickedLocationDelta] = useState(
    isLocationOn ? {latitudeDelta, longitudeDelta} : INITIAL_COORDINATE_DELTA,
  );
  const [radius, setRadius] = useState(rad ?? DEFAULT_RADIUS);

  const handleTimeToggleStatus = () => {
    if (timeToggleStatus) {
      setToggleStatus(true);
      setShowTimeSetting(false);
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
      alertError(FILTER_MSG.LATE_TIME_RANGE_ERROR);
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
    if (!showTimeSetting) {
      return false;
    }
    // reject all impossible cases
    if (isNaN(timePicker1) || isNaN(timePicker2)) {
      alertError(FILTER_MSG.EMPTY_TIME);
      return false;
    }
    if (timePicker1.getTime() > timePicker2.getTime()) {
      alertError(FILTER_MSG.EARLY_TIME_RANGE_ERROR);
      return false;
    }
    // set status as time filtering + update to PrivacyViz-Member DB
    setToggleStatus(true);
    return true;
  };

  const handleLocationToggleStatus = () => {
    if (locationToggleStatus) {
      setToggleStatus(true);
      setShowLocationSetting(false);
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
    setRadius(value ?? '0');
  };

  const validateLocationSetting = () => {
    Keyboard.dismiss();
    if (!showLocationSetting) {
      return false;
    }
    // reject all impossible cases
    if (!radius || !pickedLocation || !pickedLocationDelta) {
      alertError(FILTER_MSG.EMPTY_RADIUS);
      return false;
    }

    const parsed = parseInt(radius);
    if (isNaN(parsed) || parsed < 0 || parsed > 500) {
      alertError(FILTER_MSG.INVALID_RADIUS);
      return false;
    }
    setToggleStatus(true);

    return true;
  };

  const getCurrentFilter = () => {
    if (!showLocationSetting && !showTimeSetting) {
      alertError(FILTER_MSG.EMPTY_FILTER);
      return null;
    }
    const isLocationValid = validateLocationSetting();
    const isTimeValid = validateTimeSetting();

    if (!isLocationValid && !isTimeValid) {
      return null;
    }
    const timeInfo = isTimeValid
      ? {
          startingTime: `${timePicker1.toISOString()}`,
          endingTime: `${timePicker2.toISOString()}`,
        }
      : {};
    const locationInfo = isLocationValid
      ? {
          radius: radius,
          longitude: pickedLocation.longitude,
          latitude: pickedLocation.latitude,
          latitudeDelta: pickedLocationDelta.latitudeDelta,
          longitudeDelta: pickedLocationDelta.longitudeDelta,
        }
      : {};
    const filterType =
      isLocationValid && isTimeValid ? 'LT' : isLocationValid ? 'L' : 'T';
    const timeStamp = Date.now();

    return {
      ['type']: filterType,
      ...timeInfo,
      ...locationInfo,
      ['applyTS']: timeStamp,
    };
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
