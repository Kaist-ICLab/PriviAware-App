import React from 'react';
import {View, Text, ActivityIndicator, useColorScheme} from 'react-native';
import {LineChart, XAxis, YAxis, Grid} from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import {Circle} from 'react-native-svg';

import {formatNumber, timestampToHoursConverter} from '../../utils';
import {colorSet} from '../../constants/Colors';
import YAxisName from './YAxisName';

const flexRatio = {
  upper: 19,
  lower: 1,
  yAxis: 1,
  graph: 9,
};

const CORRECTION_VALUE = 8;

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

export function LineGraph({loading, processedData, axisName, maxData}) {
  const colorScheme = useColorScheme();
  const theme = colorScheme !== 'dark' ? '#AEAEAE' : '#DEDDE966';

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
                svg={{fontSize: 10, fill: theme}}
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
              <Grid svg={{stroke: theme}} />
              <Decorator />
            </LineChart>
            <XAxis
              style={{flex: flexRatio.lower}}
              data={processedData}
              xAccessor={d => d.item.timestamp}
              numberOfTicks={3}
              formatLabel={timestampToHoursConverter}
              contentInset={{left: 10, right: 10}}
              svg={{
                fill: theme,
              }}
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
