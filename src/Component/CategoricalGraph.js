import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { StackedBarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import { COLOURS } from './Constant';

export default function CategoricalGraph({ data, dataField, dataType, timeRange, date }) {
    const [processedData, setProcessedData] = useState([]);
    const [maxData, setMaxData] = useState(0);
    const [yAccessor, setYAccessor] = useState([]);

    const timestampToHoursConverter = (ts) => {
        const date = new Date(ts);
        return String(date.getUTCHours()).padStart(2, '0');
    };

    useEffect(() => {
        if (data.length > 0 && dataField) {
            let tempData = [];
            let tempObj = {};
            let max = 0;
            let yAccessor = [];
            for (let i = timeRange[0]; i < timeRange[1]; i = i + 60 * 60 * 1000) {
                const currentData = data.filter(d => d.timestamp >= date + i && d.timestamp < date + i + 60 * 60 * 1000)
                if (dataType === "physical_activity" && dataField.name === "type") {
                    tempObj = data.reduce((acc, obj) => {
                        const value = obj.value.activity;
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].confidence === 100) acc[value[i].type] = (acc[value[i].type] || 0) + 1;
                        }
                        return acc;
                    }, { timestamp: i });
                } else {
                    tempObj = currentData.reduce((acc, obj) => {
                        const value = obj.value[dataField.name]
                        acc[value] = (acc[value] || 0) + 1;
                        return acc;
                    }, { timestamp: i });
                }
                tempData.push(tempObj);
            }
            for (let i = 0; i < tempData.length; i++) {
                const keys = Object.keys(tempData[i]).filter(key => key !== "timestamp");
                let count = 0;
                for (let j = 0; j < keys.length; j++)
                    count = count + tempData[i][keys[j]];
                if (count > max) max = count;
                yAccessor = [...new Set([...yAccessor, ...keys])];
            }
            console.log("[RN CategoricalGraph.js] Generated data: ", JSON.stringify(tempData));
            setProcessedData(tempData);
            setMaxData(max);
            setYAccessor(yAccessor);
        }
        else setProcessedData([]);
    }, [data, dataField]);

    return (
        <View style={{ flex: 1 }}>
            {processedData.length > 0
                ?
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <YAxis
                            style={{ flex: 19 }}
                            data={processedData}
                            yAccessor={() => yAccessor}
                            min={0}
                            max={maxData}
                            contentInset={{ top: 8, bottom: 8 }}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 9 }}>
                        <StackedBarChart
                            style={{ height: "100%", flex: 19 }}
                            keys={yAccessor}
                            data={processedData}
                            colors={COLOURS}
                            yMin={0}
                            yMax={maxData}
                            yAccessor={() => yAccessor}
                            xAccessor={d => d.item.timestamp}
                            spacingInner={0.5}
                            contentInset={{ top: 8, bottom: 8 }}
                        >
                            <Grid />
                        </StackedBarChart>
                        <XAxis
                            style={{ flex: 1, height: "100%" }}
                            data={processedData}
                            xAccessor={d => d.item.timestamp}
                            scale={scale.scaleBand}
                            formatLabel={(value) => timestampToHoursConverter(value)}
                            svg={{ fontSize: 10, fill: 'black' }}
                            spacingInner={0.5}
                            contentInset={{ top: 8, bottom: 8 }}
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