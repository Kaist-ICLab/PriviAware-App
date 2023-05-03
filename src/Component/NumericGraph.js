import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

export default function NumericGraph({ data, dataField }) {
    const [processedData, setProcessedData] = useState([]);
    const [maxData, setMaxData] = useState(0);

    useEffect(() => {
        if (data.length > 0 && dataField) {
            console.log(data[0].value[dataField.name]);
            console.log(dataField);
            const tempData = data.map((d) => ({ timestamp: d.timestamp, value: d.value[dataField.name] }));
            setProcessedData(tempData);
            setMaxData(Math.max(...(tempData.map(d => d.value))));
        }
    }, [data, dataField]);

    const formatNumber = (num) => {
        if(num >= 1000000) return (num / 1000000).toFixed(1) + "m";
        if(num >= 1000) return (num /1000).toFixed(1) + "k";
        return num.toString();
    };

    const timestampToHoursConverter = (ts) => {
        const date = new Date(ts);
        return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };

    return (
        <View style={{ flex: 1 }}>
            {processedData.length > 0
                ?
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <YAxis
                            style={{ flex: 19 }}
                            data={processedData}
                            yAccessor={d => d.item.value}
                            numberOfTicks={5}
                            min={0}
                            max={maxData}
                            contentInset={{ top: 5, bottom: 5 }}
                            svg={{ fontSize: 10 }}
                            formatLabel={value => formatNumber(value)}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 9 }}>
                        <LineChart
                            style={{ height: "100%", flex: 19 }}
                            data={processedData}
                            yAccessor={d => d.item.value}
                            xAccessor={d => d.item.timestamp}
                            yMin={0}
                            yMax={maxData}
                            xScale={scale.scaleTime}
                            numberOfTicks={10}
                            svg={{ stroke: "#ff0000" }}
                            contentInset={{ top: 5, bottom: 5 }}
                        >
                            <Grid />
                        </LineChart>
                        <XAxis
                            style={{ flex: 1 }}
                            data={processedData}
                            xAccessor={d => d.item.timestamp}
                            numberOfTicks={3}
                            formatLabel={value => timestampToHoursConverter(value)}
                            contentInset={{ top: 5, bottom: 5 }}
                        />
                    </View>
                </View>
                :
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <Text style={{ alignSelf: "center", color: "#000000", fontSize: 50 }}>No Data</Text>
                </View>
            }
        </View>
    )
}