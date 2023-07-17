import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

import {Slider} from '@miblanchard/react-native-slider';
import {Picker} from '@react-native-picker/picker';

import {DATATYPE_DESCRIPTION} from '../constants/DataTypeDescription';
import {SERVER_IP_ADDR, SERVER_PORT} from '@env';
import LocationGraph from '../Component/LocationGraph';
import NumericGraph from '../Component/NumericGraph';
import CategoricalGraph from '../Component/CategoricalGraph';
import CountGraph from '../Component/CountGraph';
import {globalStyles} from '../styles/global';
import {colorSet} from '../constants/Colors';
import FilteringInfo from '../Component/FilteringInfo';

export default function SettingPage({route}) {
  const {dt, email} = route.params;
  const navigation = useNavigation();
  const [status, setStatus] = useState(route.params.status);
  // toggle related
  const [toggleStatus, setToggleStatus] = useState(
    route.params.status !== 'off',
  );
  const [timeToggleStatus, setTimeToggleStatus] = useState(
    route.params.status === 'time',
  );
  const [locationToggleStatus, setLocationToggleStatus] = useState(
    route.params.status === 'location',
  );
  // time setting related
  const [showTimeSetting, setShowTimeSetting] = useState(
    route.params.status === 'time',
  );
  const [timePicker1, setTimePicker1] = useState();
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [timePicker2, setTimePicker2] = useState();
  const [showTimePicker2, setShowTimePicker2] = useState(false);
  // location setting related
  const [showLocationSetting, setShowLocationSetting] = useState(
    route.params.status === 'location',
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
  // data visualisation related
  const [timeRange, setTimeRange] = useState([0, 24 * 60 * 60 * 1000 - 1]);
  const [timeRangeDisplay, setTimeRangeDisplay] = useState([
    0,
    24 * 60 * 60 * 1000 - 1,
  ]);
  const [date, setDate] = useState();
  const [allDate, setAllDate] = useState([]);
  const [dataField, setDataField] = useState(route.params.dt.field[0]);
  const [zeroFlag, setZeroFlag] = useState(false);
  // data record related
  const [data, setData] = useState([]);

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const timestampToHoursConverter = ts => {
    const date = new Date(ts);
    return (
      String(date.getUTCHours()).padStart(2, '0') +
      ':' +
      String(date.getUTCMinutes()).padStart(2, '0')
    );
  };

  useEffect(() => {
    const fetchFilteringSetting = async () => {
      if (route.params.status === 'time') {
        const res = await fetch(SERVER_IP_ADDR + '/getfiltering', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: route.params.email}),
        });
        const data = await res.json();
        console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
        setTimePicker1(
          new Date(data['timeFiltering'][route.params.dt.name]['startingTime']),
        );
        setTimePicker2(
          new Date(data['timeFiltering'][route.params.dt.name]['endingTime']),
        );
        // if (!data.result) AlertBox("Error", "Error in updating setting");
      } else if (route.params.status === 'location') {
        const res = await fetch(SERVER_IP_ADDR + '/getfiltering', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: route.params.email}),
        });
        const data = await res.json();
        console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
        setRadius(data['locationFiltering'][route.params.dt.name]['radius']);
        setPickedLocation({
          latitude: data['locationFiltering'][route.params.dt.name]['latitude'],
          longitude:
            data['locationFiltering'][route.params.dt.name]['longitude'],
        });
        setPickedLocationDelta({
          latitudeDelta:
            data['locationFiltering'][route.params.dt.name]['latitudeDelta'],
          longitudeDelta:
            data['locationFiltering'][route.params.dt.name]['longitudeDelta'],
        });
      }
    };
    fetchFilteringSetting();
  }, [route.params.status, route.params.email, route.params.dt]);

  useEffect(() => {
    const dates = [];
    const current = Date.now();
    const since = new Date(2023, 4, 24).getTime();
    for (let i = since; i < current; i = i + 24 * 60 * 60 * 1000) {
      const dateTemp = new Date(i);
      dates.push({
        label:
          String(dateTemp.getDate()).padStart(2, '0') +
          '-' +
          String(dateTemp.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(dateTemp.getFullYear()),
        value: i,
      });
    }
    setAllDate(dates);
  }, [route.params.dt]);

  useEffect(() => {
    const fetchDataFromDB = async () => {
      if (route.params.email && route.params.dt.name && date && timeRange) {
        console.log(
          '[RN SettingPage.js] Fetch data from DB with param user:',
          route.params.email,
          'datatype:',
          route.params.dt.name,
          'date:',
          date,
          'timeRange[0]:',
          timeRange[0],
          'timeRange[1]:',
          timeRange[1],
        );
        const res = await fetch(SERVER_IP_ADDR + '/data', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: route.params.email,
            dataType: route.params.dt.name,
            date: date,
            timeRange: timeRange,
          }),
        });
        const data = await res.json();
        console.log('[RN SettingPage.js] Received: ' + data.res.length);
        if (data.res.length === 0) setZeroFlag(true);
        else setZeroFlag(false);
        setData(data.res);
      }
    };
    fetchDataFromDB();
  }, [route.params.email, route.params.dt.name, date, timeRange]);

  const updateToDB = async newStatus => {
    const res = await fetch(SERVER_IP_ADDR + '/setstatus', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, newStatus: newStatus}),
    });
    const data = await res.json();
    console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
    if (!data.result) AlertBox('Error', 'Error in updating setting');
  };

  const showInfo = () => {
    const name =
      dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll('_', ' ');
    AlertBox(name, DATATYPE_DESCRIPTION[dt.name].description);
  };

  const handleToggleStatus = () => {
    if (status === 'off') {
      setStatus('on');
      setToggleStatus(true);
      setLocationToggleStatus(false);
      setTimeToggleStatus(false);
      updateToDB({
        ['status.' + dt.name]: 'on',
        ['timeFiltering.' + dt.name]: {},
        ['locationFiltering.' + dt.name]: {},
      });
    } else {
      setStatus('off');
      setToggleStatus(false);
      setLocationToggleStatus(false);
      setTimeToggleStatus(false);
      setShowTimeSetting(false);
      setShowLocationSetting(false);
      updateToDB({
        ['status.' + dt.name]: 'off',
        ['timeFiltering.' + dt.name]: {},
        ['locationFiltering.' + dt.name]: {},
      });
    }
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
  const handleTimeRangeOnChange = value => {
    setTimeRangeDisplay(value);
  };

  const handleTimeRangeSubmitChange = value => {
    setTimeRange(value);
  };

  const handleDate = value => {
    setDate(value);
  };

  const back = () => {
    navigation.navigate('Overview', {email: email});
  };

  return (
    <ScrollView style={{...globalStyles.container, overflow: 'scroll'}}>
      <KeyboardAvoidingView behavior="position">
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{marginLeft: 15, alignSelf: 'center'}}
              onPress={back}>
              <AntDesign name="arrowleft" size={20} />
            </TouchableOpacity>
            <Text style={{fontSize: 18, margin: 15, color: '#000000'}}>
              {dt.name.charAt(0).toUpperCase() +
                dt.name.slice(1).replaceAll('_', ' ')}{' '}
              setting
            </Text>
            <TouchableOpacity style={{alignSelf: 'center'}} onPress={showInfo}>
              <AntDesign name="questioncircleo" size={15} />
            </TouchableOpacity>
          </View>
          <View style={{margin: 15}}>
            <Switch
              trackColor={{
                true: status === 'on' ? '#128300' : '#DC7700',
                false: '#3D3D3D',
              }}
              thumbColor={'#F5F5F5'}
              onValueChange={handleToggleStatus}
              value={toggleStatus}
            />
          </View>
        </View>
        <View style={{marginHorizontal: 15, marginTop: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                flex: 3,
                alignSelf: 'center',
                fontSize: 15,
                color: '#000000',
              }}>
              Date
            </Text>
            <View
              style={{
                height: 30,
                width: '80%',
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: 'center',
                flex: 7,
              }}>
              <Picker
                style={{width: '100%'}}
                selectedValue={date}
                onValueChange={value => handleDate(value)}>
                {allDate.map(d => (
                  <Picker.Item key={d.value} label={d.label} value={d.value} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={{marginVertical: 5}}>
            <Text style={{color: '#000000', alignSelf: 'center'}}>
              Selecting time from{' '}
              {timestampToHoursConverter(timeRangeDisplay[0])} to{' '}
              {timestampToHoursConverter(timeRangeDisplay[1])}
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={24 * 60 * 60 * 1000 - 1}
              step={dataField.type === 'cat' ? 60 * 60 * 1000 : 60 * 1000}
              thumbTintColor={'#797B02'}
              minimumTrackTintColor={'#797B02'}
              value={timeRangeDisplay}
              onValueChange={value => handleTimeRangeOnChange(value)}
              onSlidingComplete={value => handleTimeRangeSubmitChange(value)}
            />
          </View>
          {route.params.dt.field.length > 1 ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  flex: 3,
                  alignSelf: 'center',
                  fontSize: 15,
                  color: '#000000',
                }}>
                Data Type
              </Text>
              <View
                style={{
                  height: 30,
                  width: '80%',
                  borderWidth: 1,
                  borderRadius: 10,
                  justifyContent: 'center',
                  flex: 7,
                }}>
                <Picker
                  style={{width: '100%'}}
                  selectedValue={dataField}
                  onValueChange={value => setDataField(value)}>
                  {route.params.dt.field.map((dt, i) => (
                    <Picker.Item key={i} label={dt.name} value={dt} />
                  ))}
                </Picker>
              </View>
            </View>
          ) : (
            <></>
          )}
          <View style={{height: 240}}>
            {status === 'off' ? (
              <View style={{justifyContent: 'center', flex: 1}}>
                <Text
                  style={{alignSelf: 'center', color: '#000000', fontSize: 50}}>
                  No Data
                </Text>
              </View>
            ) : route.params.dt.name === 'location' ? (
              <LocationGraph
                data={data}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            ) : dataField.type === 'num' ? (
              <NumericGraph
                data={data}
                dataField={dataField}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            ) : dataField.type === 'cat' ? (
              <CategoricalGraph
                data={data}
                dataField={dataField}
                dataType={route.params.dt.name}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            ) : (
              <CountGraph
                data={data}
                dataField={dataField}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            )}
          </View>
        </View>
        <Text style={styles.listTitle}>Contextual Filtering</Text>
        <FilteringInfo
          isNew={true}
          filterValues={filterValues}
          handleFilterOptions={handleFilterOptions}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 22,
    marginTop: 20,
  },
  filterDetail: {
    backgroundColor: colorSet.lightGray,
    borderRadius: 10,
    marginTop: 10,
  },
  filterListContents: {
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  detailTitle: {color: '#000000', fontSize: 15, alignSelf: 'center'},
});
