import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';


export default function CategoricalGraph({ data, dataField, dataType }) {
    const [processedData, setProcessedData] = useState([]);
    const [maxData, setMaxData] = useState(0);

    useEffect(() => {
        if (data.length > 0 && dataField) {
            let tempData = [];
            if (dataType === "physical_activity" && dataField.name === "type") {
                tempData = data.reduce((acc, obj) => {
                    const value = obj.value.activity;
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].confidence === 100) acc[value[i].type] = (acc[value[i].type] || 0) + 1;
                    }
                    return acc;
                }, {});
            } else {
                tempData = data.reduce((acc, obj) => {
                    const value = obj.value[dataField.name]
                    acc[value] = (acc[value] || 0) + 1;
                    return acc;
                }, {});
            }
            const result = Object.entries(tempData).map(([key, value]) => ({ name: key, count: value }));
            console.log("[RN CategoricalGraph.js] Generated data: ", JSON.stringify(result));
            setProcessedData(result);
            setMaxData(Math.max(...(result.map(d => d.count))));
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
                            yAccessor={d => d.item.count}
                            min={0}
                            max={maxData}
                            contentInset={{ top: 8, bottom: 8 }}
                        />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 9 }}>
                        <BarChart
                            style={{ height: "100%", flex: 19 }}
                            data={processedData}
                            yMin={0}
                            yMax={maxData}
                            yAccessor={d => d.item.count}
                            xAccessor={d => d.item.name}
                            svg={{ fill: "#ff0000" }}
                            spacingInner={0.5}
                            contentInset={{ top: 8, bottom: 8 }}
                        >
                            <Grid />
                        </BarChart>
                        <XAxis
                            style={{ flex: 1, height: "100%" }}
                            data={processedData}
                            xAccessor={d => d.item.name}
                            scale={scale.scaleBand}
                            formatLabel={(value) => {
                                if(value.length > 10) return value.split("_")[value.split("_").length - 1]
                                else return value;
                            }}
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