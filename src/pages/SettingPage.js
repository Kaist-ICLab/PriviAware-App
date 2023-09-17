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
  ToastAndroid,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import {DATATYPE_DESCRIPTION} from '../constants/DataTypeDescription';

import LocationGraph from '../Component/LocationGraph';
import NumericGraph from '../Component/NumericGraph';
import CategoricalGraph from '../Component/CategoricalGraph';
import CountGraph from '../Component/CountGraph';
import {globalStyles} from '../styles/global';
import {colorSet} from '../constants/Colors';
import FilteringInfo from '../Component/FilteringInfo';
import {
  dateToString,
  dateToTimeString,
  dateToTimestamp,
  convertDataType,
  dateToTimestampWithoutDate,
} from '../utils';
import CustomDateTimepickerModal from '../Component/CustomDateTimepickerModal';
import dayjs from 'dayjs';
import {
  deleteFilteringList,
  getData,
  getFilteringList,
  setFilteringList,
  setFilteringStatus,
  updateFilteringList,
} from '../apis';

export default function SettingPage({route}) {
  const {colors} = useTheme();
  const today = new Date();

  const startToday = dayjs(today).startOf('day');
  const endToday = dayjs(today).endOf('day');

  const {dt, email} = route.params;
  const navigation = useNavigation();
  const [status, setStatus] = useState(route.params.status);
  // toggle related
  const [toggleStatus, setToggleStatus] = useState(
    route.params.status !== 'off',
  );

  const [filterInfo, setFilterInfo] = useState([]);

  // data visualization related
  const [timeRange, setTimeRange] = useState([
    new Date(startToday),
    new Date(endToday),
  ]);

  const [date, setDate] = useState(new Date(startToday));

  const [dataField, setDataField] = useState(route.params.dt.field[0]);
  const [zeroFlag, setZeroFlag] = useState(false);
  // data record related
  const [data, setData] = useState([]);

  const validateTimeRange = (startDate, endDate) => {
    if (startDate.getTime() > endDate.getTime()) {
      AlertBox('Error', 'Starting time cannot be later than ending time');
      return false;
    }
    return true;
  };

  const AlertBox = (title, msg) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ]);
  };

  const fetchFilteringSetting = async () => {
    const data = await getFilteringList(route.params.email);

    console.log('[RN SettingPage.js] Filter Received: ' + JSON.stringify(data));
    const filterList = data.filtering[route.params.dt.name];

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
    fetchFilteringSetting();
  }, [route.params.status, route.params.email, route.params.dt]);

  useEffect(() => {
    const fetchDataFromDB = async () => {
      if (route.params.email && route.params.dt.name && date && timeRange) {
        const startDate = new Date(dayjs(date).startOf('day'));

        const timeRangetoTimestamp = [
          dateToTimestampWithoutDate(timeRange[0]),
          dateToTimestampWithoutDate(timeRange[1]),
        ];

        console.log(
          '[RN SettingPage.js] Fetch data from DB with param user:',
          route.params.email,
          'datatype:',
          route.params.dt.name,
          'date:',
          dateToTimestamp(startDate),
          'timeRange[0]:',
          timeRangetoTimestamp[0],
          'timeRange[1]:',
          timeRangetoTimestamp[1],
        );

        const data = await getData(
          route.params.email,
          route.params.dt.name,
          dateToTimestamp(startDate),
          timeRangetoTimestamp,
        );

        console.log('[RN SettingPage.js] Data Received: ' + data.res.length);
        if (data.res.length === 0) setZeroFlag(true);
        else setZeroFlag(false);
        setData(data.res);
      }
    };

    fetchDataFromDB();
  }, [route.params.email, route.params.dt.name, date, timeRange]);

  const updateToDB = async newStatus => {
    const data = await setFilteringStatus(email, newStatus);
    console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
    if (!data.result) AlertBox('Error', 'Error in updating setting');
  };

  const addFilteringDB = async (dataType, condition) => {
    console.log('[RN SettingPage.js] addFilteringDB: ', dataType, condition);
    const data = await setFilteringList(email, dataType, condition);

    console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('A filter was successfully added!', ToastAndroid.SHORT);
    } else {
      AlertBox('Error', 'Error in appending filtering');
    }
  };

  const updateFilteringDB = async (
    dataType,
    originalCondition,
    newCondition,
  ) => {
    console.log(
      '[RN SettingPage.js] updateFilteringDB: ',
      dataType,
      originalCondition,
      newCondition,
    );
    const data = updateFilteringList(
      email,
      dataType,
      originalCondition,
      newCondition,
    );
    console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));

    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('saved', ToastAndroid.SHORT);
    } else {
      AlertBox('Error', 'Error in updating filtering');
    }
  };

  const deleteFilteringDB = async (dataType, condition) => {
    const data = await deleteFilteringList(email, dataType, condition);
    console.log('[RN SettingPage.js] Received: ' + JSON.stringify(data));
    fetchFilteringSetting();
    if (data.result) {
      ToastAndroid.show('A filter was deleted', ToastAndroid.SHORT);
    } else {
      AlertBox('Error', 'Error in deleting filtering');
    }
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
    console.log(
      value,
      'newDate1',
      changeDate(value, timeRange[0]),
      'newDate2',
      changeDate(value, timeRange[1]),
    );

    setTimeRange(prev => [
      changeDate(value, prev[0]),
      changeDate(value, prev[1]),
    ]);
  };

  const handleTimeRange = (value, index) => {
    console.log('now timerange', timeRange);
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

  const dataType = convertDataType(route.params.dt.name);

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
            <Text style={{fontSize: 18, margin: 15, color: colors.text}}>
              {dataType} setting
            </Text>
            <TouchableOpacity style={{alignSelf: 'center'}} onPress={showInfo}>
              <AntDesign name="questioncircleo" size={15} />
            </TouchableOpacity>
          </View>
          <View style={{margin: 15}}>
            <Switch
              trackColor={{
                true: status === 'off' ? '#D9D9D9' : '#5A5492',
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
            <Text
              style={{...styles.propertyTitle, flex: 3, color: colors.text}}>
              Date
            </Text>
            <View style={styles.datePickerInput}>
              <CustomDateTimepickerModal
                mode="date"
                data={date}
                handleData={handleDate}
                textFormatter={dateToString}
                textStyle={[
                  styles.dateTimePickerText,
                  {backgroundColor: colors.card},
                ]}
              />
            </View>
          </View>

          <View style={styles.spacedRow}>
            <Text
              style={{...styles.propertyTitle, flex: 3, color: colors.text}}>
              Hour
            </Text>
            <View style={styles.timePickerInput}>
              <CustomDateTimepickerModal
                mode="time"
                // timeRange is UTC time but datetimepicker is using local time. So we need to convert UTC to local time
                data={timeRange[0]}
                handleData={v => handleTimeRange(v, 0)}
                textFormatter={dateToTimeString}
                textStyle={[
                  styles.dateTimePickerText,
                  {backgroundColor: colors.card},
                ]}
              />
            </View>
            <Text
              style={{
                ...styles.propertyTitle,
                flex: 2,
                textAlign: 'center',
              }}>
              to
            </Text>
            <View style={styles.timePickerInput}>
              <CustomDateTimepickerModal
                mode="time"
                data={timeRange[1]}
                handleData={v => handleTimeRange(v, 1)}
                textFormatter={dateToTimeString}
                textStyle={[
                  styles.dateTimePickerText,
                  {backgroundColor: colors.card},
                ]}
              />
            </View>
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
          <View style={{height: 240, marginTop: 20}}>
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
                data={data} //data
                dataType={convertDataType(route.params.dt.name)}
                dataField={dataField}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            ) : dataField.type === 'cat' ? (
              <CategoricalGraph
                data={data} //data
                dataField={dataField}
                dataType={route.params.dt.name}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
              />
            ) : (
              <CountGraph
                data={data} //data
                dataField={dataField}
                timeRange={timeRange}
                date={date}
                zeroFlag={zeroFlag}
                dataType={convertDataType(route.params.dt.name)}
              />
            )}
          </View>
        </View>
        <Text style={styles.listTitle}>Contextual Filtering</Text>

        {filterInfo.map((filter, i) => (
          <FilteringInfo
            key={i}
            index={i}
            isNew={false}
            filter={filter}
            setToggleStatus={setToggleStatus}
            updateToDB={updateToDB}
            addFiltering={addFilteringDB}
            updateFiltering={updateFilteringDB}
            deleteFiltering={deleteFilteringDB}
            dt={dt}
            filterStatus={route.params.status}
          />
        ))}
        <FilteringInfo
          isNew={true}
          setToggleStatus={setToggleStatus}
          updateToDB={updateToDB}
          addFiltering={addFilteringDB}
          updateFiltering={updateFilteringDB}
          deleteFiltering={deleteFilteringDB}
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
    height: 24,
    width: '80%',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colorSet.secondary,
    justifyContent: 'center',
    flex: 12,
  },
  timePickerInput: {
    height: 24,
    width: '50%',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colorSet.secondary,
    justifyContent: 'center',
    flex: 5,
  },
  dateTimePickerText: {
    color: colorSet.gray,
    paddingStart: 10,
  },
});
