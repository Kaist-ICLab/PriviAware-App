import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { DATATYPE } from './Constant';

export default function OverviewPage({ route }) {
    const { email } = route.params;

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1 }}>
            <Text style={{ fontSize: 18, margin: 15, color: "#000000" }}>Logged in as: {email}</Text>
            <ScrollView>
                {DATATYPE.map((dt, i) => {
                    return (
                        <View key={i} style={{ backgroundColor: (i % 2 ? "#D9D9D9" : "#F3F2F2"), flexDirection: "row" }}>
                            <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 13 }}>
                                <Text style={{ fontSize: 15, textDecorationLine: "underline", color: "#000000" }}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignSelf: "center" }}>
                                <AntDesign name="questioncircleo" size={15} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
            <View style={{ marginHorizontal: 15, marginTop: 5 }}>
                <Text>Status dot colour:</Text>
                <Text>Green: on, Orange: on with filtering, Grey: off</Text>
            </View>
            <View style={{ marginTop: 10, marginBottom: 20, alignSelf: "center" }}>
                <TouchableOpacity style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F3F2F2" }}>
                    <Text style={{ color: "#000000" }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}