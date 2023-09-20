import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {SENSITIVE_DATATYPE, NORMAL_DATATYPE} from '@constants/DataType';
import {globalStyles} from '@styles/global';
import {useOverview} from './useOverview';
import {convertUpperCaseWithBlank} from '@utils/common';

const collectionStatus = {
  ON: '#5A5492',
  OFF: '#D9D9D9',
};

export function OverviewPage({route}) {
  const {colors} = useTheme();
  const {email} = route.params;
  const {status, loading, navToSetting, showInfo, logout} = useOverview(email);

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: colors.background}]}>
      <View style={{opacity: loading ? 0.3 : 1, flex: 1}}>
        <Text style={globalStyles.header}>Data Types</Text>
        <Text style={styles.loginInfo}>Logged in as: {email}</Text>

        <ScrollView>
          <Text style={styles.listTitle}>Sensitive</Text>
          {SENSITIVE_DATATYPE.map((dt, i) => (
            <View key={i} style={styles.listContent}>
              <View style={globalStyles.row}>
                <MaterialCommunityIcons
                  name={dt.icon}
                  size={20}
                  style={styles.icon}
                />
                <TouchableOpacity
                  style={{marginEnd: 10, marginVertical: 13}}
                  onPress={() => navToSetting(dt)}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {convertUpperCaseWithBlank(dt.name)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => showInfo(dt)}>
                  <AntDesign name="questioncircleo" size={15} />
                </TouchableOpacity>
              </View>
              <View style={styles.dotContainer}>
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'off'
                        ? collectionStatus.OFF
                        : collectionStatus.ON,
                  }}
                />
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'filter'
                        ? collectionStatus.ON
                        : collectionStatus.OFF,
                  }}
                />
              </View>
            </View>
          ))}
          <Text style={styles.listTitle}>Not Sensitive</Text>
          {NORMAL_DATATYPE.map((dt, i) => (
            <View key={i} style={styles.listContent}>
              <View style={globalStyles.row}>
                <MaterialCommunityIcons
                  name={dt.icon}
                  size={20}
                  style={styles.icon}
                />
                <TouchableOpacity
                  style={{marginEnd: 10, marginVertical: 13}}
                  onPress={() => navToSetting(dt)}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {convertUpperCaseWithBlank(dt.name)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => showInfo(dt)}>
                  <AntDesign name="questioncircleo" size={15} />
                </TouchableOpacity>
              </View>

              <View style={styles.dotContainer}>
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'off'
                        ? collectionStatus.OFF
                        : collectionStatus.ON,
                  }}
                />
                <View
                  style={{
                    ...styles.dotStatus,
                    backgroundColor:
                      status[dt.name] === 'filter'
                        ? collectionStatus.ON
                        : collectionStatus.OFF,
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
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
            <Text styles={globalStyles.row}>
              right circle - filtering status
            </Text>
          </View>
        </View>
        <View style={{marginTop: 20, marginBottom: 20, alignSelf: 'center'}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: '#F3F2F2',
            }}
            onPress={logout}>
            <Text style={{color: '#000000'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 5,
  },
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
  loginInfo: {fontSize: 15, color: '#000000'},
  extraInformation: {marginTop: 10, flexDirection: 'row'},
});
