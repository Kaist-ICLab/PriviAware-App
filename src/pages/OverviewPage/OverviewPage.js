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
import {useTheme} from '@react-navigation/native';

import {SENSITIVE_DATATYPE, NORMAL_DATATYPE} from '@constants/DataType';
import {globalStyles} from '@styles/global';
import {useOverview} from './useOverview';
import {StatusIndicator} from './components/StatusIndicator';
import {DataList} from './components/DataList';

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
          <DataList
            dataList={SENSITIVE_DATATYPE}
            status={status}
            navToSetting={navToSetting}
            showInfo={showInfo}
          />

          <Text style={styles.listTitle}>Not Sensitive</Text>
          <DataList
            dataList={NORMAL_DATATYPE}
            status={status}
            navToSetting={navToSetting}
            showInfo={showInfo}
          />
        </ScrollView>
        <StatusIndicator />
        <View style={{marginTop: 20, marginBottom: 20, alignSelf: 'center'}}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
  loginInfo: {fontSize: 15, color: '#000000'},
  logoutButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F2F2',
  },
});
