import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import MapView from 'react-native-maps';
import {Marker, Callout} from 'react-native-maps';

export function LocationGraph({data, timeRange, date, zeroFlag}) {
  const [processedLoc, setProcessedLoc] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tempProcessedData = [];
    const tempProcessedLoc = [];
    // setting the data array with object format {latitude, longitude, [altitude], [timestamp]}
    for (let i = 0; i < data.length; i++) {
      tempProcessedData.push({
        latitude: data[i].value.latitude,
        longitude: data[i].value.longitude,
        altitude: new Array(1).fill(data[i].value.altitude),
        timestamp: new Array(1).fill(data[i].timestamp),
      });
    }
    // merging the data that will be represented with the same pin tgt
    for (let i = 0; i < tempProcessedData.length; i++) {
      // if processedLoc is empty (init)
      if (tempProcessedLoc.length === 0)
        tempProcessedLoc.push(tempProcessedData[i]);
      else {
        for (let j = 0; j < tempProcessedLoc.length; j++) {
          // if will be represented by the same pin
          if (
            Math.abs(
              tempProcessedData[i].latitude - tempProcessedLoc[j].latitude,
            ) < 0.0000005 &&
            tempProcessedData[i].longitude === tempProcessedLoc[j].longitude
          ) {
            tempProcessedLoc[j].altitude.push(tempProcessedData[i].altitude[0]);
            tempProcessedLoc[j].timestamp.push(
              tempProcessedData[i].timestamp[0],
            );
            break;
          }
          // if will be represented by different pins
          if (j === tempProcessedLoc.length - 1) {
            tempProcessedLoc.push(tempProcessedData[i]);
            break;
          }
        }
      }
    }
    setProcessedLoc(tempProcessedLoc);
  }, [data]);

  useEffect(() => {
    setLoading(true);
  }, [data, timeRange, date]);

  useEffect(() => {
    if ((data.length > 0 && processedLoc.length > 0) || zeroFlag)
      setLoading(false);
  }, [data, processedLoc, zeroFlag]);

  const localTimestampToHoursConverter = ts => {
    const date = new Date(ts);
    return (
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0')
    );
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : processedLoc.length > 0 ? (
        <MapView
          style={{height: '100%', width: '100%'}}
          initialRegion={{
            latitude: processedLoc[0].latitude,
            longitude: processedLoc[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {processedLoc.map((loc, i) => {
            return (
              <Marker
                key={i}
                coordinate={{latitude: loc.latitude, longitude: loc.longitude}}
                icon={require('../../assets/images/pin.png')}>
                <Callout>
                  <View>
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: '#000000',
                        fontWeight: 'bold',
                      }}>
                      Detail
                    </Text>
                    {loc.timestamp.map((ts, i) => {
                      return (
                        <Text
                          style={{
                            color: '#000000',
                          }}
                          key={i}>
                          {'Timestamp: ' +
                            localTimestampToHoursConverter(ts) +
                            ', Altitude: ' +
                            String(loc.altitude[i].toFixed(2))}
                        </Text>
                      );
                    })}
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
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
