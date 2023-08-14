import React, {useState} from 'react';
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MapView, {Circle} from 'react-native-maps';
import {FakeMarker} from 'react-native-map-coordinate-picker';
import Collapsible from 'react-native-collapsible';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {DarkTheme, LightTheme, colorSet} from '../constants/Colors';
import useFilter from './useFilteringInfo';

const BUTTON_TEXT = {
  SAVE: 'Save',
  DELETE: 'Delete',
  ADD: 'Add',
};

function FilteringInfo({
  index,
  isNew,
  filter,
  setToggleStatus,
  addFiltering,
  updateFiltering,
  deleteFiltering,
  updateToDB,
  dt,
  filterStatus,
}) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme.colors : LightTheme.colors;

  const {handleFilterOptions, filterValues} = useFilter(
    setToggleStatus,
    updateToDB,
    addFiltering,
    updateFiltering,
    deleteFiltering,
    dt,
    filterStatus,
    filter,
  );

  const {
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
  } = handleFilterOptions;

  const {
    timeToggleStatus,
    showTimeSetting,
    timePicker1,
    timePicker2,
    showTimePicker1,
    showTimePicker2,
    showLocationSetting,
    locationToggleStatus,
    pickedLocationDelta,
    pickedLocation,
    radius,
    dragging,
  } = filterValues;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  const handleAnimation = () => {
    Animated.timing(rotateAnimation, {
      toValue: isCollapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {});
  };

  const cwRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: cwRotating,
      },
    ],
  };

  const blockName = [];

  if (filter !== undefined) {
    if (filter.type.includes('L')) {
      blockName.push('Location Filter');
    }
    if (filter.type.includes('T')) {
      blockName.push('Time Filter');
    }
  }
  return (
    <View
      style={{
        ...styles.filteringInfoWrapper,
        backgroundColor: isNew ? theme.lightGray : theme.lightPurple,
      }}>
      <TouchableOpacity
        style={styles.filteringInfoRow}
        onPress={async () => {
          handleAnimation();
          setIsCollapsed(() => !isCollapsed);
        }}>
        <Text>
          {blockName.length === 0
            ? 'New Filter'
            : `${index + 1}. ${blockName.join(' , ')}`}
        </Text>
        {isNew ? (
          <View style={styles.dotButton}>
            <MaterialCommunityIcons name="plus" color="#ffffff" size={20} />
          </View>
        ) : (
          <Animated.View style={[animatedStyle, styles.dotButton]}>
            <MaterialCommunityIcons
              name="chevron-up"
              color="#ffffff"
              size={22}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.filterDetail}>
          <View style={{marginBottom: 10}}>
            <View style={styles.spacedRow}>
              <Text style={styles.filterTitle}>Time</Text>
              <Switch
                trackColor={{true: colorSet.primary, false: colorSet.gray}}
                thumbColor={'#F5F5F5'}
                onValueChange={handleTimeToggleStatus}
                value={timeToggleStatus}
              />
            </View>
            {showTimeSetting && (
              <View style={styles.spacedRow}>
                <Text style={styles.filterDirection}>Do not collect from</Text>
                <TouchableOpacity
                  style={{marginHorizontal: 10, alignSelf: 'center'}}
                  onPress={handleShowTimePicker1}>
                  <View style={styles.textInput}>
                    {!isNaN(timePicker1) ? (
                      <Text style={{alignSelf: 'center'}}>
                        {timePicker1.getHours().toString().padStart(2, '0') +
                          ':' +
                          timePicker1.getMinutes().toString().padStart(2, '0')}
                      </Text>
                    ) : (
                      <Text style={{alignSelf: 'center'}}>00:00</Text>
                    )}
                  </View>
                  <DateTimePickerModal
                    isVisible={showTimePicker1}
                    mode="time"
                    onConfirm={handleTimePicker1Confirm}
                    onCancel={handleShowTimePicker1}
                  />
                </TouchableOpacity>
                <Text style={styles.filterDirection}>to</Text>
                <TouchableOpacity
                  style={{marginHorizontal: 10, alignSelf: 'center'}}
                  onPress={handleShowTimePicker2}>
                  <View style={styles.textInput}>
                    {!isNaN(timePicker2) ? (
                      <Text style={{alignSelf: 'center'}}>
                        {timePicker2.getHours().toString().padStart(2, '0') +
                          ':' +
                          timePicker2.getMinutes().toString().padStart(2, '0')}
                      </Text>
                    ) : (
                      <Text style={{alignSelf: 'center'}}>00:00</Text>
                    )}
                  </View>
                  <DateTimePickerModal
                    isVisible={showTimePicker2}
                    mode="time"
                    onConfirm={handleTimePicker2Confirm}
                    onCancel={handleShowTimePicker2}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{marginBottom: 10}}>
            <View style={styles.spacedRow}>
              <Text style={styles.filterTitle}>Location</Text>
              <Switch
                trackColor={{true: colorSet.primary, false: colorSet.gray}}
                thumbColor={'#F5F5F5'}
                onValueChange={handleLocationToggleStatus}
                value={locationToggleStatus}
              />
            </View>
            {showLocationSetting && (
              <>
                <View
                  style={{
                    ...styles.spacedRow,
                    marginVertical: 10,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.filterDirection}>
                    Do not collect within
                  </Text>
                  <View style={styles.textInput}>
                    <TextInput
                      style={{
                        paddingVertical: 0,
                        alignSelf: 'center',
                      }}
                      keyboardType="number-pad"
                      onChangeText={handleRadius}
                      defaultValue={`${radius ?? 0}`}
                      value={radius}
                    />
                  </View>
                  <Text style={styles.filterDirection}>m of the pin</Text>
                </View>
                <View>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude: pickedLocation.latitude,
                      longitude: pickedLocation.longitude,
                      latitudeDelta: pickedLocationDelta.latitudeDelta,
                      longitudeDelta: pickedLocationDelta.longitudeDelta,
                    }}
                    onPanDrag={handleOnPanDrag}
                    onRegionChangeComplete={handleRegionChange}>
                    <Circle
                      center={{
                        latitude: pickedLocation.latitude,
                        longitude: pickedLocation.longitude,
                      }}
                      strokeWidth={1}
                      opacity={0.5}
                      strokeColor={colorSet.primary}
                      fillColor={'#5A54921A'}
                      radius={
                        isNaN(parseFloat(radius)) ? 0 : parseFloat(radius)
                      }
                    />
                  </MapView>
                  <FakeMarker
                    dragging={dragging}
                    icon={require('../assets/images/pin_resized.png')}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.centeredRow}>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: colorSet.primary}}
              onPress={isNew ? addFilter : editFilter}>
              <Text style={styles.buttonText}>
                {isNew ? BUTTON_TEXT.ADD : BUTTON_TEXT.SAVE}
              </Text>
            </TouchableOpacity>

            {!isNew && (
              <TouchableOpacity
                style={{...styles.button, backgroundColor: colorSet.gray}}
                onPress={deleteFilter}>
                <Text style={styles.buttonText}>{BUTTON_TEXT.DELETE}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  filterDetail: {
    padding: 10,
  },
  filteringInfoWrapper: {
    borderRadius: 20,
    marginTop: 10,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  filteringInfoRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotButton: {
    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorSet.primary,
  },
  listContent: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  centeredRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  textInput: {
    height: 25,
    width: 50,
    opacity: 0.5,
    borderColor: colorSet.gray,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {height: 200, width: '100%'},
  filterDirection: {
    fontSize: 15,
    alignSelf: 'center',
  },
});

export default FilteringInfo;
