import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Alert, PermissionsAndroid, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import RNExitApp from 'react-native-exit-app';

import { SENSITIVE_DATATYPE, NORMAL_DATATYPE } from './Constant';
import { DATATYPE_DESCRIPTION } from './DataTypeDescription';
import { SERVER_IP_ADDR, SERVER_PORT } from '@env';

export default function OverviewPage({ route }) {
    const { email } = route.params;
    const navigation = useNavigation();
    const [status, setStatus] = useState({});
    const [loading, setLoading] = useState(true);

    const PermissionAlertBox = (title, msg) => {
        Alert.alert(title, msg, [
            {
                text: "OK", onPress: RNExitApp.exitApp
            }
        ]);
    };

    useEffect(() => {
        const getInitGPSPermission = async () => {
            const res = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
            if (res) {
                BackgroundTimer.runBackgroundTimer(() => {
                    Geolocation.getCurrentPosition(pos => {
                        try {
                            fetch(SERVER_IP_ADDR + "/locationrecord", {
                                method: "POST",
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ locationRecord: { email: email, longitude: pos.coords.longitude, latitude: pos.coords.latitude, timestamp: Date.now() } })
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    });
                }, 600000);
            } else {
                PermissionAlertBox("Warning", "Functions in this application require your location data. Some of the functions might not be accessble if you do not provide location data to this application.\n*You can always update this permission in Setting (Allow all the time).")
            }
        };
        getInitGPSPermission();
    }, []);


    const getStatus = async () => {
        setLoading(true);
        const res = await fetch(SERVER_IP_ADDR + "/status", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const data = await res.json();
        console.log("[RN OverviewPage.js] Received: " + JSON.stringify(data));
        setStatus(data);
    };

    useEffect(() => {
        setLoading(false);
    }, [status]);

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
        AlertBox(name, DATATYPE_DESCRIPTION[dt.name].description);
    };

    const logoutAction = () => {
        navigation.navigate("Login");
        BackgroundTimer.stopBackgroundTimer();
    };

    const logout = () => {
        Alert.alert("Warning", "Logging out will stop the location detecting in this application.\nLocation filtering setting might not be working as expected.\nAre you sure you want to logout?", [
            {
                text: "Cancel", style: "cancel"
            },
            {
                text: "OK", onPress: logoutAction
            }
        ]);
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1 }}>
            <View style={{ opacity: (loading ? 0.3 : 1), flex: 1 }}>
                <Text style={{ fontSize: 18, margin: 15, color: "#000000" }}>Logged in as: {email}</Text>
                <ScrollView>
                    <Text style={{ marginHorizontal: 15, marginVertical: 10, color: "#b10000", fontSize: 15, fontWeight: "bold" }}>Sensitive Data</Text>
                    {SENSITIVE_DATATYPE.map((dt, i) => {
                        return (
                            <View key={i} style={{ backgroundColor: (i % 2 ? "#D9D9D9" : "#F3F2F2"), flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 13 }} onPress={() => navToSetting(dt)}>
                                        <Text style={{ fontSize: 15, textDecorationLine: "underline", color: "#b10000", fontWeight: "bold" }}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => showInfo(dt)}>
                                        <AntDesign name="questioncircleo" size={15} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: 18, height: 18, borderRadius: 9, alignSelf: "center", marginRight: 20, backgroundColor: (status[dt.name] === "on" ? "#128300" : status[dt.name] === "off" ? "#3D3D3D" : "#DC7700") }} />
                            </View>
                        )
                    })}
                    <Text style={{ marginHorizontal: 15, marginVertical: 10, color: "#000000", fontSize: 15 }}>Other Data</Text>
                    {NORMAL_DATATYPE.map((dt, i) => {
                        return (
                            <View key={i} style={{ backgroundColor: (i % 2 ? "#D9D9D9" : "#F3F2F2"), flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 13 }} onPress={() => navToSetting(dt)}>
                                        <Text style={{ fontSize: 15, textDecorationLine: "underline", color: "#000000", fontWeight: "normal" }}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ")}</Text>
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
                <View style={{ marginTop: 20, marginBottom: 20, alignSelf: "center" }}>
                    <TouchableOpacity style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F3F2F2" }} onPress={logout}>
                        <Text style={{ color: "#000000" }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loading
                ?
                <View style={{ flex: 1, justifyContent: "center", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                    <ActivityIndicator size="large" />
                </View>
                :
                <></>
            }
        </SafeAreaView >
    )
}