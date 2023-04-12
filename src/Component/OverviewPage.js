import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import { DATATYPE } from './Constant';
import { SERVER_IP_ADDR, SERVER_PORT } from '@env';

export default function OverviewPage({ route }) {
    const { email } = route.params;
    const navigation = useNavigation();
    const [status, setStatus] = useState({});

    const getStatus = async () => {
        const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/status", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        console.log("[RN OverviewPage.js] Received: " + JSON.stringify(data));
        setStatus(data);
    };

    // run once this page is loaded
    useEffect(() => {
        const focusHandler = navigation.addListener("focus", () => {
            getStatus();
        });
        return focusHandler;
    }, [navigation]);

    const AlertBox = (title, msg) => {
        Alert.alert(title, msg, [
            {
                text: "OK", style: "cancel"
            }
        ]);
    };

    const navToSetting = (dt) => {
        navigation.navigate("Setting", { dt: dt, status: status[dt.name], email: email });
    };

    const showInfo = (dt) => {
        const name = dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ");
        AlertBox(name, name + " description");
    };

    const logout = () => {
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1 }}>
            <Text style={{ fontSize: 18, margin: 15, color: "#000000" }}>Logged in as: {email}</Text>
            <ScrollView>
                {DATATYPE.map((dt, i) => {
                    return (
                        <View key={i} style={{ backgroundColor: (i % 2 ? "#D9D9D9" : "#F3F2F2"), flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 13 }} onPress={() => navToSetting(dt)}>
                                    <Text style={{ fontSize: 15, textDecorationLine: "underline", color: "#000000" }}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => showInfo(dt)}>
                                    <AntDesign name="questioncircleo" size={15} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: 18, height: 18, borderRadius: 9, alignSelf: "center", marginRight: 20, backgroundColor: (status[dt.name] === "on" ? "#128300" : status[dt.name] === "off" ? "#3D3D3D" : "#DC7700") }} />
                        </View>
                    )
                })}
            </ScrollView>
            <View style={{ marginHorizontal: 15, marginTop: 5 }}>
                <Text>Status dot colour:</Text>
                <Text>Green: on, Orange: on with filtering, Grey: off</Text>
            </View>
            <View style={{ marginTop: 10, marginBottom: 20, alignSelf: "center" }}>
                <TouchableOpacity style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F3F2F2" }} onPress={logout}>
                    <Text style={{ color: "#000000" }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}