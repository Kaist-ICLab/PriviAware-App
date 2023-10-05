import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {globalStyles} from '@styles/global';

const collectionStatus = {
  ON: '#5A5492',
  OFF: '#D9D9D9',
};

export function StatusIndicator() {
  return (
    <View style={styles.extraInformation}>
      <View style={styles.dotContainer}>
        <View
          style={{
            ...styles.largeDotStatus,
            backgroundColor: collectionStatus.ON,
          }}>
          <Text style={[{color: '#ffffff'}, styles.statusText]}>ON</Text>
        </View>
        <View
          style={{
            ...styles.largeDotStatus,
            backgroundColor: collectionStatus.OFF,
          }}>
          <Text style={[{color: '#000000'}, styles.statusText]}>OFF</Text>
        </View>
      </View>
      <View>
        <Text styles={globalStyles.row}>
          left circle - data collection status
        </Text>
        <Text styles={globalStyles.row}>right circle - filtering status</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeDotStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statusText: {
    fontSize: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
  },
  extraInformation: {marginTop: 10, flexDirection: 'row'},
});
