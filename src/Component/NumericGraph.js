import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {LineChart, XAxis, YAxis, Grid} from 'react-native-svg-charts';
import {Circle} from 'react-native-svg';
import * as scale from 'd3-scale';

import {formatNumber, timestampToHoursConverter} from '../utils';
import {colorSet} from '../constants/Colors';
import YAxisName from './YAxisName';

/**
 * drawing circles for each data point
 */
const Decorator = ({x, y, data}) => {
  return data.map((point, index) => {
    return (
      <Circle
        key={index}
        cx={x(point.timestamp)}
        cy={y(point.value)}
        r={3}
        stroke={colorSet.primary}
      />
    );
  });
};

const flexRatio = {
  upper: 19,
  lower: 1,
  yAxis: 1,
  graph: 9,
};

const CORRECTION_VALUE = 7;

export default function NumericGraph({
  data,
  dataField,
  dataType,
  timeRange,
  date,
  zeroFlag,
}) {
  const [processedData, setProcessedData] = useState([]);
  const [maxData, setMaxData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length > 0 && dataField) {
      const tempData = data.map(d => ({
        timestamp: d.timestamp,
        value: d.value[dataField.name],
      }));
      setProcessedData(tempData);
      setMaxData(Math.max(...tempData.map(d => d.value)));
    } else setProcessedData([]);
  }, [data, dataField]);

  useEffect(() => {
    setLoading(true);
  }, [data, dataField, timeRange, date]);

  //for the development, the after the date changed, new data will be fetched.
  //but this is mock data, so the data will not be changed.
  //I include date at useEffect's dependency array to make sure the data will be fetched again.
  //after attach the normal api, you should remove the date from the dependency array.

  useEffect(() => {
    if ((data.length > 0 && processedData.length > 0) || zeroFlag) {
      setLoading(false);
    }
  }, [data, processedData, zeroFlag, date]);

  const axisName = `${dataType} ${dataField.name}`;

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : processedData.length > 0 ? (
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: flexRatio.yAxis, flexDirection: 'row'}}>
            <YAxisName
              textHeight={10}
              textLength={axisName.length * CORRECTION_VALUE}
              name={axisName}
            />
            <View>
              <YAxis
                style={{flex: flexRatio.upper}}
                data={processedData}
                yAccessor={d => d.item.value}
                numberOfTicks={5}
                min={0}
                max={maxData}
                contentInset={{top: 5, bottom: 10}}
                svg={{fontSize: 10}}
                formatLabel={formatNumber}
              />
              <View style={{flex: flexRatio.lower}} />
            </View>
          </View>
          <View style={{flex: flexRatio.graph}}>
            <LineChart
              style={{height: '100%', flex: flexRatio.upper}}
              data={processedData}
              yAccessor={d => d.item.value}
              xAccessor={d => d.item.timestamp}
              yMin={0}
              yMax={maxData}
              xScale={scale.scaleTime}
              numberOfTicks={10}
              svg={{stroke: colorSet.primary}}
              contentInset={{top: 5, bottom: 10, left: 10, right: 10}}>
              <Grid />
              <Decorator />
            </LineChart>
            <XAxis
              style={{flex: flexRatio.lower}}
              data={processedData}
              xAccessor={d => d.item.timestamp}
              numberOfTicks={3}
              formatLabel={timestampToHoursConverter}
              contentInset={{left: 10, right: 10}}
            />
          </View>
        </View>
      ) : (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={{alignSelf: 'center', color: '#000000', fontSize: 50}}>
            No Data
          </Text>
        </View>
      )}
    </View>
  );
}
