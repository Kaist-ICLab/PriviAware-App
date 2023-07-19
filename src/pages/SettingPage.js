import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {Slider} from '@miblanchard/react-native-slider';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {DATATYPE_DESCRIPTION} from '../constants/DataTypeDescription';
import {SERVER_IP_ADDR, SERVER_PORT} from '@env';
import LocationGraph from '../Component/LocationGraph';
import NumericGraph from '../Component/NumericGraph';
import CategoricalGraph from '../Component/CategoricalGraph';
import CountGraph from '../Component/CountGraph';
import {globalStyles} from '../styles/global';
import {colorSet} from '../constants/Colors';
import FilteringInfo from '../Component/FilteringInfo';
import filterList from '../mocks/filterInfo';
import {timestampToHoursConverter, dateToString} from '../utils';

// TODO: datepicker 까지 만들어놓고 전달드리기

export default function SettingPage({route}) {
  const {dt, email} = route.params;
  const navigation = useNavigation();
  const [status, setStatus] = useState(route.params.status);
  // toggle related
  const [toggleStatus, setToggleStatus] = useState(
    route.params.status !== 'off',
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    handleDate(date);
    hideDatePicker();
  };

  // TODO: load filter List data from server, here is a mock data
  const [filterInfo, setFilterInfo] = useState(filterList);

  // data visualisation related
  const [timeRange, setTimeRange] = useState([0, 24 * 60 * 60 * 1000 - 1]);
  const [timeRangeDisplay, setTimeRangeDisplay] = useState([
    0,
    24 * 60 * 60 * 1000 - 1,
  ]);
  const [date, setDate] = useState(new Date());

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

  useEffect(() => {
    const fetchFilteringSetting = async () => {
      // TODO fetch filter data as list format from server
      const res = await fetch(SERVER_IP_ADDR + '/getfiltering', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: route.params.email}),
      });
      const data = await res.json();
      console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
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
      updateToDB({
        ['status.' + dt.name]: 'on',
        ['timeFiltering.' + dt.name]: {},
        ['locationFiltering.' + dt.name]: {},
      });
    } else {
      setStatus('off');
      setToggleStatus(false);
      updateToDB({
        ['status.' + dt.name]: 'off',
        ['timeFiltering.' + dt.name]: {},
        ['locationFiltering.' + dt.name]: {},
      });
    }
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
    <KeyboardAvoidingView
      behavior="height"
      enabled
      keyboardVerticalOffset={10}
      style={{flex: 1, flexDirection: 'column', ...globalStyles.container}}>
      <ScrollView>
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
          <View style={styles.spacedRow}>
            <Text style={{...styles.propertyTitle, flex: 3}}>Date</Text>
            <View style={styles.datePickerInput}>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <TouchableOpacity onPress={showDatePicker}>
                <Text>{dateToString(date)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.spacedRow}>
            <Text style={{...styles.propertyTitle, flex: 3}}>Hour</Text>
            <View style={styles.datePickerInput}></View>
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

        {filterInfo.map((filter, i) => (
          <FilteringInfo
            key={i}
            isNew={false}
            filter={filter}
            setToggleStatus={setToggleStatus}
            updateToDB={updateToDB}
            dt={dt}
            filterStatus={route.params.status}
          />
        ))}

        <FilteringInfo
          isNew={true}
          setToggleStatus={setToggleStatus}
          updateToDB={updateToDB}
          dt={dt}
          filterStatus={route.params.status}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  spacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  propertyTitle: {
    alignSelf: 'center',
    fontSize: 15,
    color: '#000000',
  },
  datePickerInput: {
    height: 30,
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colorSet.secondary,
    backgroundColor: colorSet.lightGray,
    justifyContent: 'center',
    flex: 7,
  },
});
