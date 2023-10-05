import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles/global';
import {convertUpperCaseWithBlank} from '@utils/common';

const collectionStatus = {
  ON: '#5A5492',
  OFF: '#D9D9D9',
};

export function DataList({dataList, status, navToSetting, showInfo}) {
  return dataList.map((dt, i) => (
    <Data
      key={i}
      data={dt}
      status={status}
      navToSetting={navToSetting}
      showInfo={showInfo}
    />
  ));
}

function Data({data, status, navToSetting, showInfo}) {
  const {icon, name} = data;

  return (
    <View style={styles.listContent}>
      <View style={globalStyles.row}>
        <MaterialCommunityIcons name={icon} size={20} style={styles.icon} />
        <TouchableOpacity
          style={{marginEnd: 10, marginVertical: 13}}
          onPress={() => navToSetting(data)}>
          <Text
            style={{
              fontSize: 16,
            }}>
            {convertUpperCaseWithBlank(name)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => showInfo(data)}>
          <AntDesign name="questioncircleo" size={15} />
        </TouchableOpacity>
      </View>
      <View style={styles.dotContainer}>
        <View
          style={{
            ...styles.dotStatus,
            backgroundColor:
              status[name] === 'off'
                ? collectionStatus.OFF
                : collectionStatus.ON,
          }}
        />
        <View
          style={{
            ...styles.dotStatus,
            backgroundColor:
              status[name] === 'filter'
                ? collectionStatus.ON
                : collectionStatus.OFF,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {marginHorizontal: 4, marginVertical: 13},
  dotStatus: {
    width: 16,
    height: 16,
    borderRadius: 9,
    alignSelf: 'center',
    marginRight: 8,
  },
  dotContainer: {
    flexDirection: 'row',
  },
});
