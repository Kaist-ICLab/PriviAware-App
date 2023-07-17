import React, {useState} from 'react';
import {Keyboard, Alert} from 'react-native';

const useFilter = (setToggleStatus, updateToDB, dt, filterStatus) => {
  const [status, setStatus] = useState(filterStatus);

  const [timeToggleStatus, setTimeToggleStatus] = useState(
    filterStatus === 'time',
  );
  const [locationToggleStatus, setLocationToggleStatus] = useState(
    filterStatus === 'location',
  );
  // time setting related
  const [showTimeSetting, setShowTimeSetting] = useState(
    filterStatus === 'time',
  );
  const [timePicker1, setTimePicker1] = useState();
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [timePicker2, setTimePicker2] = useState();
  const [showTimePicker2, setShowTimePicker2] = useState(false);
  // location setting related
  const [showLocationSetting, setShowLocationSetting] = useState(
    filterStatus === 'location',
  );
  const [dragging, setDragging] = useState(false);
  const [pickedLocation, setPickedLocation] = useState({
    latitude: 36.374228,
    longitude: 127.365861,
  });
  const [pickedLocationDelta, setPickedLocationDelta] = useState({
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0122,
  });
  const [radius, setRadius] = useState();

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

  const handleTimePicker1Confirm = date => {
    setTimePicker1(date);
    handleShowTimePicker1();
  };

  const handleShowTimePicker2 = () => {
    setShowTimePicker2(!showTimePicker2);
  };

  const handleTimePicker2Confirm = date => {
    setTimePicker2(date);
    handleShowTimePicker2();
  };

  const applyTimeSetting = () => {
    // reject all impossible cases
    if (!timePicker1 || !timePicker2) {
      AlertBox('Error', 'Please enter both starting time and ending time');
      setShowTimeSetting(false);
      setTimeToggleStatus(false);
      if (status === 'time') {
        setStatus('on');
        updateToDB({
          ['status.' + dt.name]: 'on',
          ['timeFiltering.' + dt.name]: {},
        });
        return;
      }
      updateToDB({
        ['status.' + dt.name]: status,
        ['timeFiltering.' + dt.name]: {},
      });
      return;
    }
    if (timePicker1 > timePicker2) {
      AlertBox('Error', 'Starting time cannot be earlier than ending time');
      setShowTimeSetting(false);
      setTimeToggleStatus(false);
      if (status === 'time') {
        setStatus('on');
        updateToDB({
          ['status.' + dt.name]: 'on',
          ['timeFiltering.' + dt.name]: {},
        });
        return;
      }
      updateToDB({
        ['status.' + dt.name]: status,
        ['timeFiltering.' + dt.name]: {},
      });
      return;
    }
    // set status as time filtering + update to PrivacyViz-Member DB
    setStatus('time');
    setToggleStatus(true);
    updateToDB({
      ['status.' + dt.name]: 'time',
      ['timeFiltering.' + dt.name + '.startingTime']: timePicker1,
      ['timeFiltering.' + dt.name + '.endingTime']: timePicker2,
      ['timeFiltering.' + dt.name + '.applyTS']: Date.now(),
    });
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
    setRadius(value);
  };

  const applyLocationSetting = () => {
    Keyboard.dismiss();
    // reject all impossible cases
    if (!radius || !pickedLocation || !pickedLocationDelta) {
      AlertBox('Error', 'Please enter the distance');
      setShowLocationSetting(false);
      setLocationToggleStatus(false);
      if (status === 'location') {
        setStatus('on');
        updateToDB({
          ['status.' + dt.name]: 'on',
          ['locationFiltering.' + dt.name]: {},
        });
        return;
      }
      updateToDB({
        ['status.' + dt.name]: status,
        ['locationFiltering.' + dt.name]: {},
      });
      return;
    }
    const parsed = parseInt(radius);
    if (isNaN(parsed) || parsed < 0 || parsed > 500) {
      AlertBox('Error', 'Please enter an integer between 0 and 500');
      setShowLocationSetting(false);
      setLocationToggleStatus(false);
      if (status === 'location') {
        setStatus('on');
        updateToDB({
          ['status.' + dt.name]: 'on',
          ['locationFiltering.' + dt.name]: {},
        });
        return;
      }
      updateToDB({
        ['status.' + dt.name]: status,
        ['locationFiltering.' + dt.name]: {},
      });
      return;
    }
    setStatus('location');
    setToggleStatus(true);
    updateToDB({
      ['status.' + dt.name]: 'location',
      ['locationFiltering.' + dt.name + '.radius']: radius,
      ['locationFiltering.' + dt.name + '.longitude']: pickedLocation.longitude,
      ['locationFiltering.' + dt.name + '.latitude']: pickedLocation.latitude,
      ['locationFiltering.' + dt.name + '.latitudeDelta']:
        pickedLocationDelta.latitudeDelta,
      ['locationFiltering.' + dt.name + '.longitudeDelta']:
        pickedLocationDelta.longitudeDelta,
      ['locationFiltering.' + dt.name + '.applyTS']: Date.now(),
    });
  };

  const handleFilterOptions = {
    handleShowTimePicker1,
    handleShowTimePicker2,
    handleTimeToggleStatus,
    handleTimePicker1Confirm,
    handleTimePicker2Confirm,
    applyTimeSetting,
    handleLocationToggleStatus,
    handleOnPanDrag,
    handleRegionChange,
    handleRadius,
    applyLocationSetting,
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
