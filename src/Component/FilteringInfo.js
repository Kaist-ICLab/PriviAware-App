import React, {useState} from 'react';
import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MapView from 'react-native-maps';
import {FakeMarker} from 'react-native-map-coordinate-picker';
import Collapsible from 'react-native-collapsible';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {colorSet} from '../constants/Colors';

function FilteringInfo({isNew, handleFilterOptions, filterValues}) {
  const {
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
      toValue: isCollapsed ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {});
  };

  const cwRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: cwRotating,
      },
    ],
  };

  return (
    <View
      style={{
        ...styles.filteringInfoWrapper,
        backgroundColor: isNew ? colorSet.lightGray : colorSet.secondary,
      }}>
      <TouchableOpacity
        style={styles.filteringInfoRow}
        onPress={async () => {
          handleAnimation();
          setIsCollapsed(() => !isCollapsed);
        }}>
        <Text> New Filter </Text>
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
          <View style={{marginHorizontal: 15, marginTop: 10}}>
            <View style={styles.spacedRow}>
              <Text style={styles.detailTitle}>Time</Text>
              <Switch
                style={{alignSelf: 'center'}}
                trackColor={{true: colorSet.primary, false: '#3D3D3D'}}
                thumbColor={'#F5F5F5'}
                onValueChange={handleTimeToggleStatus}
                value={timeToggleStatus}
              />
            </View>
            {showTimeSetting && (
              <View style={{marginTop: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      alignSelf: 'center',
                    }}>
                    Do not collect from
                  </Text>
                  <TouchableOpacity
                    style={{marginHorizontal: 10, alignSelf: 'center'}}
                    onPress={handleShowTimePicker1}>
                    <View
                      style={{
                        backgroundColor: '#FAFAFA',
                        height: 25,
                        width: 50,
                        justifyContent: 'center',
                      }}>
                      {timePicker1 ? (
                        <Text style={{alignSelf: 'center', color: '#000000'}}>
                          {timePicker1.getHours().toString().padStart(2, '0') +
                            ':' +
                            timePicker1
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
                    <DateTimePickerModal
                      isVisible={showTimePicker1}
                      mode="time"
                      onConfirm={handleTimePicker1Confirm}
                      onCancel={handleShowTimePicker1}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      alignSelf: 'center',
                    }}>
                    to
                  </Text>
                  <TouchableOpacity
                    style={{marginHorizontal: 10, alignSelf: 'center'}}
                    onPress={handleShowTimePicker2}>
                    <View
                      style={{
                        backgroundColor: '#FAFAFA',
                        height: 25,
                        width: 50,
                        justifyContent: 'center',
                      }}>
                      {timePicker2 ? (
                        <Text style={{alignSelf: 'center', color: '#000000'}}>
                          {timePicker2.getHours().toString().padStart(2, '0') +
                            ':' +
                            timePicker2
                              .getMinutes()
                              .toString()
                              .padStart(2, '0')}
                        </Text>
                      ) : (
                        <></>
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
              </View>
            )}
          </View>
          <View style={{marginBottom: 15}}>
            <View
              style={{
                marginHorizontal: 15,
                marginTop: 10,
                ...styles.spacedRow,
              }}>
              <Text style={styles.detailTitle}>Location</Text>
              <Switch
                style={{alignSelf: 'center'}}
                trackColor={{true: colorSet.primary, false: '#3D3D3D'}}
                thumbColor={'#F5F5F5'}
                onValueChange={handleLocationToggleStatus}
                value={locationToggleStatus}
              />
            </View>
            {showLocationSetting && (
              <View style={{marginHorizontal: 15, marginTop: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#000000',
                        alignSelf: 'center',
                      }}>
                      Do not collect when I'm within
                    </Text>
                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                      <View
                        style={{
                          backgroundColor: '#FAFAFA',
                          height: 25,
                          width: 50,
                          justifyContent: 'center',
                          marginRight: 10,
                        }}>
                        <TextInput
                          style={{paddingVertical: 0, alignSelf: 'center'}}
                          keyboardType="number-pad"
                          onChangeText={value => handleRadius(value)}
                          value={radius}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000000',
                          alignSelf: 'center',
                        }}>
                        m from this point
                      </Text>
                    </View>
                  </View>
                </View>
                <MapView
                  style={{height: 200, width: '100%'}}
                  region={{
                    latitude: pickedLocation.latitude,
                    longitude: pickedLocation.longitude,
                    latitudeDelta: pickedLocationDelta.latitudeDelta,
                    longitudeDelta: pickedLocationDelta.longitudeDelta,
                  }}
                  onPanDrag={handleOnPanDrag}
                  onRegionChangeComplete={handleRegionChange}
                />
                <FakeMarker dragging={dragging} />
              </View>
            )}
          </View>

          <View style={styles.centeredRow}>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: colorSet.primary}}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{...styles.button, backgroundColor: colorSet.gray}}
              onPress={() => {}}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
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
  spacedRow: {flexDirection: 'row', justifyContent: 'space-between'},
  centeredRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

export default FilteringInfo;
