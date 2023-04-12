import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

import { SERVER_IP_ADDR, SERVER_PORT } from '@env';

export default function SettingPage({ route }) {
    const { dt, email } = route.params;
    const navigation = useNavigation();
    const [status, setStatus] = useState(route.params.status);
    const [toggleStatus, setToggleStatus] = useState((status === "off" ? false : true));
    const [timeToggleStatus, setTimeToggleStatus] = useState(status === "time");
    const [locationToggleStatus, setLocationToggleStatus] = useState(status === "location");

    const AlertBox = (title, msg) => {
        Alert.alert(title, msg, [
            {
                text: "OK", style: "cancel"
            }
        ]);
    };

    const updateToDB = async (newStatus) => {
        const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/setstatus", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, newStatus: newStatus })
        });
        const data = await res.json();
        console.log("[RN SettingPage.js] Received: " + JSON.stringify(data));
        if(!data.result) AlertBox("Error", "Error in updating setting");
    }

    const showInfo = () => {
        const name = dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ");
        AlertBox(name, name + " description");
    };

    const handleToggleStatus = () => {
        if (status === "off") {
            setStatus("on");
            setToggleStatus(true);
            setLocationToggleStatus(false);
            setTimeToggleStatus(false);
            updateToDB({ ["status." + dt.name]: "on" });
        } else {
            setStatus("off");
            setToggleStatus(false);
            setLocationToggleStatus(false);
            setTimeToggleStatus(false);
            updateToDB({ ["status." + dt.name]: "off" });
        }
    };

    const handleTimeToggleStatus = () => {
        if (timeToggleStatus) {
            setStatus("on");
            setToggleStatus(true);
            updateToDB({ ["status." + dt.name]: "on" });
        }
        else {
            if (locationToggleStatus) {
                AlertBox("Error", "Turn off location filtering before turning on time filtering");
                return;
            }
            setStatus("filter");
            setToggleStatus(true);
            updateToDB({ ["status." + dt.name]: "time" });
        }
        setTimeToggleStatus(!timeToggleStatus);
    };

    const handleLocationToggleStatus = () => {
        if (locationToggleStatus) {
            setStatus("on");
            setToggleStatus(true);
            updateToDB({ ["status." + dt.name]: "on" });
        }
        else {
            if (timeToggleStatus) {
                AlertBox("Error", "Turn off time filtering before turning on location filtering");
                return;
            }
            setStatus("filter");
            setToggleStatus(true);
            updateToDB({ ["status." + dt.name]: "location" });
        }
        setLocationToggleStatus(!locationToggleStatus);
    };

    const back = () => {
        navigation.navigate("Overview", { email: email });
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, margin: 15, color: "#000000" }}>{dt.name.charAt(0).toUpperCase() + dt.name.slice(1).replaceAll("_", " ")} setting</Text>
                    <TouchableOpacity style={{ alignSelf: "center" }} onPress={showInfo}>
                        <AntDesign name="questioncircleo" size={15} />
                    </TouchableOpacity>
                </View>
                <View style={{ margin: 15 }}>
                    <Switch
                        trackColor={{ true: (status === "on" ? "#128300" : "#DC7700"), false: "#3D3D3D" }}
                        thumbColor={"#F5F5F5"}
                        onValueChange={handleToggleStatus}
                        value={toggleStatus}
                    />
                </View>
            </View>
            <View style={{ backgroundColor: "#D9D9D9", height: 120, marginHorizontal: 15, justifyContent: "center" }}>
                <Text style={{ alignSelf: "center", color: "#000000", fontSize: 50 }}>Graph</Text>
            </View>
            <Text style={{ marginHorizontal: 15, marginTop: 50, color: "#000000", fontSize: 18 }}>Filtering</Text>
            <View style={{ marginHorizontal: 15, marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#000000", fontSize: 15, alignSelf: "center" }}>Time</Text>
                <Switch
                    style={{ alignSelf: "center" }}
                    trackColor={{ true: "#128300", false: "#3D3D3D" }}
                    thumbColor={"#F5F5F5"}
                    onValueChange={handleTimeToggleStatus}
                    value={timeToggleStatus}
                />
            </View>
            <View style={{ marginHorizontal: 15, marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: "#000000", fontSize: 15, alignSelf: "center" }}>Location</Text>
                <Switch
                    style={{ alignSelf: "center" }}
                    trackColor={{ true: "#128300", false: "#3D3D3D" }}
                    thumbColor={"#F5F5F5"}
                    onValueChange={handleLocationToggleStatus}
                    value={locationToggleStatus}
                />
            </View>
            <View style={{ marginTop: 10, marginBottom: 20, alignSelf: "center" }}>
                <TouchableOpacity style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F3F2F2" }} onPress={back}>
                    <Text style={{ color: "#000000" }}>Back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}