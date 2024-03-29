import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {StackedBarChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import YAxisName from './YAxisName';
import {
  convertDataType,
  dateToTimestamp,
  dateToTimestampWithoutDate,
  timestampToFullHoursConverter,
  timestampToHoursWithUnitConverter,
} from '@utils/common';
import {PASTEL_COLORS, BRIGHT_COLORS} from '@constants/Colors';
import {AlertBox} from '@utils/alert';

const CORRECTION_VALUE = 5;
const HOUR_MILLISECONDS = 60 * 60 * 1000;

export function CategoricalGraph({
  data,
  dataField,
  dataType,
  timeRange,
  date,
  zeroFlag,
}) {
  const [processedData, setProcessedData] = useState([]);
  const [maxData, setMaxData] = useState(0);
  const [yAccessor, setYAccessor] = useState([]);
  const [label, setLabel] = useState([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const theme = colorScheme !== 'dark' ? '#AEAEAE' : '#DEDDE966';
  const graphColorSet = colorScheme === 'dark' ? BRIGHT_COLORS : PASTEL_COLORS;

  useEffect(() => {
    if (data.length > 0 && dataField) {
      let tempData = [];
      let tempObj = {};
      let max = 0;
      let tempyAccessor = [];
      let filteredDataNum = 0;

      const startTimestamp = dateToTimestampWithoutDate(timeRange[0]);
      const endTimestamp = dateToTimestampWithoutDate(timeRange[1]);

      for (
        let i = startTimestamp;
        i < endTimestamp;
        i = i + HOUR_MILLISECONDS
      ) {
        const dateTimeStamp = parseInt(dateToTimestamp(date), 10) + i;

        const currentData = data.filter(
          d =>
            d.timestamp >= dateTimeStamp &&
            d.timestamp < dateTimeStamp + HOUR_MILLISECONDS,
        );

        filteredDataNum += currentData.length;

        if (dataType === 'physical_activity' && dataField.name === 'type') {
          tempObj = data.reduce(
            (acc, obj) => {
              const value = obj.value.activity;
              for (let i = 0; i < value.length; i++) {
                if (value[i].confidence === 100)
                  acc[value[i].type] = (acc[value[i].type] || 0) + 1;
              }
              return acc;
            },
            {timestamp: i},
          );
        } else {
          tempObj = currentData.reduce(
            (acc, obj) => {
              const value = obj.value[dataField.name];
              acc[value] = (acc[value] || 0) + 1;
              return acc;
            },
            {timestamp: i},
          );
          tempData.push(tempObj);
        }
      }

      for (let i = 0; i < tempData.length; i++) {
        const keys = Object.keys(tempData[i]).filter(
          key => key !== 'timestamp',
        );
        let count = 0;
        for (let j = 0; j < keys.length; j++)
          count = count + tempData[i][keys[j]];
        if (count > max) max = count;
        tempyAccessor = [...new Set([...tempyAccessor, ...keys])];
      }

      for (let i = 0; i < tempData.length; i++) {
        for (let j = 0; j < tempyAccessor.length; j++) {
          if (!tempData[i][tempyAccessor[j]]) tempData[i][tempyAccessor[j]] = 0;
        }
      }

      console.log(
        '[RN CategoricalGraph.js] Generated data: ',
        JSON.stringify(tempData),
      );

      setProcessedData(() => (filteredDataNum === 0 ? [] : tempData));
      setMaxData(max);
      setYAccessor(tempyAccessor);
      setLabel(
        tempyAccessor.map((k, i) => {
          return {key: k, color: graphColorSet[i]};
        }),
      );
    } else setProcessedData([]);
  }, [data, dataField]);

  useEffect(() => {
    setLoading(true);
  }, [data, dataField, dataType, timeRange, date]);

  useEffect(() => {
    if (data.length > 0 || zeroFlag) setLoading(false);
  }, [data, processedData, zeroFlag]);

  const showFewEntries = key => {
    let description = '';
    if (dataType === 'app_usage_event')
      description = description.concat(
        'Data in this category recorded the event triggered by the app ' +
          (key.length === 0 ? '(No name)' : key) +
          '\n',
      );
    if (dataType === 'call_log')
      description = description.concat(
        'Data in this category recorded the ' + key + ' phone calls' + '\n',
      );
    if (dataType === 'media')
      description = description.concat(
        'Data in this category recorded the media with type of ' + key + '\n',
      );
    if (dataType === 'message')
      description = description.concat(
        'Data in this category recorded the ' + key + ' messages' + '\n',
      );
    if (dataType === 'notification')
      description = description.concat(
        'Data in this category recorded the notification from the app ' +
          (key.length === 0 ? '(No name)' : key + '\n'),
      );
    let separation = '=================\n';
    let rawData = '';
    let amount = 0;
    const filteredData = data.filter(d => d.value[dataField.name] === key);
    if (filteredData.length < 5) amount = filteredData.length;
    else amount = 5;
    for (let i = 0; i < amount; i++) {
      rawData = rawData.concat(
        'time: ' +
          timestampToFullHoursConverter(filteredData[i].timestamp) +
          '\n',
      );
      let keys = Object.keys(filteredData[i].value);
      for (let j = 0; j < keys.length; j++)
        rawData = rawData.concat(
          keys[j] + ': ' + filteredData[i].value[keys[j]] + '\n',
        );
      rawData = rawData.concat('\n');
    }
    if (key.length === 0) key = '(No name)';
    AlertBox(
      'Collected data related to "' + key + '"',
      description + separation + rawData + '(At most 5 entries are shown)',
    );
  };

  const axisName = `${convertDataType(dataType)}`;

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : processedData.length > 0 ? (
        <View style={{flex: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <YAxisName
              textHeight={10}
              textLength={axisName.length * CORRECTION_VALUE}
              name={axisName}
            />
            <View style={{flex: 11, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <YAxis
                  style={{flex: 19}}
                  data={processedData}
                  yAccessor={() => yAccessor}
                  min={0}
                  max={maxData}
                  svg={{fontSize: 10, fill: theme}}
                  contentInset={{top: 8, bottom: 8, left: 10, right: 10}}
                />
                <View style={{flex: 1}}></View>
              </View>
              <View style={{flex: 18}}>
                <StackedBarChart
                  style={{height: '100%', flex: 19}}
                  keys={yAccessor}
                  data={processedData}
                  colors={graphColorSet}
                  yMin={0}
                  yMax={maxData}
                  yAccessor={() => yAccessor}
                  xAccessor={d => d.item.timestamp}
                  spacingInner={0.5}
                  contentInset={{top: 8, bottom: 8, left: 10, right: 10}}>
                  <Grid svg={{strokeOpacity: 0.5, stroke: theme}} />
                </StackedBarChart>
                <XAxis
                  style={{flex: 1, height: '100%'}}
                  data={processedData}
                  xAccessor={d => d.item.timestamp}
                  scale={scale.scaleBand}
                  formatLabel={(value, i) => {
                    if (!(i % 2))
                      return timestampToHoursWithUnitConverter(value);
                  }}
                  svg={{fontSize: 10, fill: theme}}
                  spacingInner={0.5}
                  contentInset={{top: 8, bottom: 8, left: 10, right: 10}}
                />
              </View>
            </View>
          </View>
          <Text style={{color: '#000000', fontSize: 10, alignSelf: 'center'}}>
            Time
          </Text>
          <View style={{marginTop: 5}}>
            <FlatList
              data={label}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginRight: 10,
                      alignSelf: 'center',
                    }}
                    onPress={() => showFewEntries(item.key)}>
                    <View
                      style={{
                        backgroundColor: item.color,
                        height: 10,
                        width: 10,
                        marginRight: 5,
                        alignSelf: 'center',
                      }}></View>
                    <Text style={{textDecorationLine: 'underline'}}>
                      {item.key.length === 0 ? '(No name)' : item.key}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              horizontal
            />
          </View>
        </View>
      ) : (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: 50}}>No Data</Text>
        </View>
      )}
    </View>
  );
}
