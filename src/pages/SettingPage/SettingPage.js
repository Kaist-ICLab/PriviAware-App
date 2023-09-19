import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {colorSet} from '@constants/Colors';

import FilteringInfo from '@components/Filtering/FilteringInfo';
import CustomDateTimepickerModal from '@components/Common/CustomDateTimepickerModal';

import {globalStyles} from '@styles/global';
import {dateToString, dateToTimeString} from '@utils/common';
import {
  CategoricalGraph,
  CountGraph,
  LocationGraph,
  NumericGraph,
} from '@components/Graphs';
import {useSetting} from './useSetting';

export function SettingPage({route}) {
  const {colors} = useTheme();
  const {dt, email, status: savedStatus} = route.params;

  const {
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
    updateToDB,
    dataType,
  } = useSetting(email, dt, savedStatus);

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
                data={data}
                dataType={dataType}
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
                dataType={dataType}
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
