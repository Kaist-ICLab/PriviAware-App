import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

export default function CountGraph({ data, dataField }) {
    const [processedData, setProcessedData] = useState([]);
    const [maxData, setMaxData] = useState(0);


    useEffect(() => {
        if (dataField) {
            let queryField = "";
            if (dataField.name === "numOfAP") queryField = "accessPoint";
            if (dataField.name === "numOfApps") queryField = "app";
            const tempData = data.map((d) => ({ timestamp: d.timestamp, value: d.value[queryField].length }));
            setMaxData(Math.max(...(tempData.map(d => d.value))));
            setProcessedData(tempData);
        }
    }, [data, dataField]);

    const timestampToHoursConverter = (ts) => {
        const date = new Date(ts);
        return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0');
    };
    const test = [1, 2, 3, 4, 5, 6]

    return (
        <View style={{ flex: 1 }}>
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
                        contentInset={{ top: 5, bottom: 5, left: 0 }}
                    />
                </View>
            </View>
        </View>
    )
}