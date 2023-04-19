import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert, Switch, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MapView from 'react-native-maps';
import { FakeMarker } from 'react-native-map-coordinate-picker';

import { SERVER_IP_ADDR, SERVER_PORT } from '@env';

export default function SettingPage({ route }) {
    const { dt, email } = route.params;
    const navigation = useNavigation();
    const [status, setStatus] = useState(route.params.status);
    const [toggleStatus, setToggleStatus] = useState(route.params.status !== "off");
    const [timeToggleStatus, setTimeToggleStatus] = useState(route.params.status === "time");
    const [locationToggleStatus, setLocationToggleStatus] = useState(route.params.status === "location");
    const [showTimeSetting, setShowTimeSetting] = useState(route.params.status === "time");
    const [timePicker1, setTimePicker1] = useState();
    const [showTimePicker1, setShowTimePicker1] = useState(false);
    const [timePicker2, setTimePicker2] = useState();
    const [showTimePicker2, setShowTimePicker2] = useState(false);
    const [showLocationSetting, setShowLocationSetting] = useState(route.params.status === "location");
    const [dragging, setDragging] = useState(false);
    const [pickedLocation, setPickedLocation] = useState({ latitude: 36.374228, longitude: 127.365861 });
    const [pickedLocationDelta, setPickedLocationDelta] = useState({ latitudeDelta: 0.0122, longitudeDelta: 0.0122 });
    const [radius, setRadius] = useState();

    const AlertBox = (title, msg) => {
        Alert.alert(title, msg, [
            {
                text: "OK", style: "cancel"
            }
        ]);
    };

    useEffect(() => {
        const fetchFilteringSetting = async () => {
            if (route.params.status === "time") {
                const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/getfiltering", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: route.params.email })
                });
                const data = await res.json();
                console.log("[RN SettingPage.js] Received: " + JSON.stringify(data));
                setTimePicker1(new Date(data["timeFiltering"][route.params.dt.name]["startingTime"]));
                setTimePicker2(new Date(data["timeFiltering"][route.params.dt.name]["endingTime"]));
                // if (!data.result) AlertBox("Error", "Error in updating setting");
            } else if (route.params.status === "location") {
                const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/getfiltering", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: route.params.email })
                });
                const data = await res.json();
                console.log("[RN SettingPage.js] Received: " + JSON.stringify(data));
                setRadius(data["locationFiltering"][route.params.dt.name]["radius"]);
                setPickedLocation({ latitude: data["locationFiltering"][route.params.dt.name]["latitude"], longitude: data["locationFiltering"][route.params.dt.name]["longitude"] });
                setPickedLocationDelta({ latitudeDelta: data["locationFiltering"][route.params.dt.name]["latitudeDelta"], longitudeDelta: data["locationFiltering"][route.params.dt.name]["longitudeDelta"] });
            }
        };
        fetchFilteringSetting();
    }, [route.params.status, route.params.email, route.params.dt]);

    const updateToDB = async (newStatus) => {
        const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/setstatus", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, newStatus: newStatus })
        });
        const data = await res.json();
        console.log("[RN SettingPage.js] Received: " + JSON.stringify(data));
        if (!data.result) AlertBox("Error", "Error in updating setting");
    };

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
            updateToDB({ ["status." + dt.name]: "on", ["timeFiltering." + dt.name]: {} });
        } else {
            setStatus("off");
            setToggleStatus(false);
            setLocationToggleStatus(false);
            setTimeToggleStatus(false);
            setShowTimeSetting(false);
            setShowLocationSetting(false);
            updateToDB({ ["status." + dt.name]: "off", ["timeFiltering." + dt.name]: {} });
        }
    };

    const handleTimeToggleStatus = () => {
        if (timeToggleStatus) {
            setStatus("on");
            setToggleStatus(true);
            setShowTimeSetting(false);
            updateToDB({ ["status." + dt.name]: "on", ["timeFiltering." + dt.name]: {} });
        }
        else {
            // return if location filtering is on
            if (locationToggleStatus) {
                AlertBox("Error", "Turn off location filtering before turning on time filtering");
                return;
            }
            // Show time setting for user
            setShowTimeSetting(true);
        }
        setTimeToggleStatus(!timeToggleStatus);
    };

    const handleShowTimePicker1 = () => {
        setShowTimePicker1(!showTimePicker1);
    };

    const handleTimePicker1Confirm = (date) => {
        setTimePicker1(date);
        handleShowTimePicker1();
    };

    const handleShowTimePicker2 = () => {
        setShowTimePicker2(!showTimePicker2);
    };

    const handleTimePicker2Confirm = (date) => {
        setTimePicker2(date);
        handleShowTimePicker2();
    };

    const applyTimeSetting = () => {
        // reject all impossible cases
        if (!timePicker1 || !timePicker2) {
            AlertBox("Error", "Please enter both starting time and ending time");
            setShowTimeSetting(false);
            setTimeToggleStatus(false);
            if (status === "time") {
                setStatus("on");
                updateToDB({ ["status." + dt.name]: "on", ["timeFiltering." + dt.name]: {} });
                return;
            }
            updateToDB({ ["status." + dt.name]: status, ["timeFiltering." + dt.name]: {} });
            return;
        }
        if (timePicker1 > timePicker2) {
            AlertBox("Error", "Starting time cannot be earlier than ending time");
            setShowTimeSetting(false);
            setTimeToggleStatus(false);
            if (status === "time") {
                setStatus("on");
                updateToDB({ ["status." + dt.name]: "on", ["timeFiltering." + dt.name]: {} });
                return;
            }
            updateToDB({ ["status." + dt.name]: status, ["timeFiltering." + dt.name]: {} });
            return;
        }
        // set status as time filtering + update to PrivacyViz-Member DB
        setStatus("time");
        setToggleStatus(true);
        updateToDB({ ["status." + dt.name]: "time", ["timeFiltering." + dt.name + ".startingTime"]: timePicker1, ["timeFiltering." + dt.name + ".endingTime"]: timePicker2 });
    };

    const handleLocationToggleStatus = () => {
        if (locationToggleStatus) {
            setStatus("on");
            setToggleStatus(true);
            setShowLocationSetting(false);
            updateToDB({ ["status." + dt.name]: "on", ["timeFiltering." + dt.name]: {} });
        }
        else {
            if (timeToggleStatus) {
                AlertBox("Error", "Turn off time filtering before turning on location filtering");
                return;
            }
            // Show location setting for user
            setShowLocationSetting(true);
        }
        setLocationToggleStatus(!locationToggleStatus);
    };

    const handleOnPanDrag = () => {
        setDragging(true);
    };

    const handleRegionChange = (region) => {
        setDragging(false);
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
        setPickedLocation({ latitude, longitude });
        setPickedLocationDelta({ latitudeDelta, longitudeDelta });
    };

    const handleRadius = (value) => {
        setRadius(value);
    };

    const applyLocationSetting = () => {
        Keyboard.dismiss();
        // reject all impossible cases
        if (!radius || !pickedLocation || !pickedLocationDelta) {
            AlertBox("Error", "Please enter the distance");
            setShowLocationSetting(false);
            setLocationToggleStatus(false);
            if (status === "location") {
                setStatus("on");
                updateToDB({ ["status." + dt.name]: "on", ["locationFiltering." + dt.name]: {} });
                return;
            }
            updateToDB({ ["status." + dt.name]: status, ["locationFiltering." + dt.name]: {} });
            return;
        }
        const parsed = parseInt(radius);
        if (isNaN(parsed) || parsed < 0 || parsed > 500) {
            AlertBox("Error", "Please enter an integer between 0 and 500");
            setShowLocationSetting(false);
            setLocationToggleStatus(false);
            if (status === "location") {
                setStatus("on");
                updateToDB({ ["status." + dt.name]: "on", ["locationFiltering." + dt.name]: {} });
                return;
            }
            updateToDB({ ["status." + dt.name]: status, ["locationFiltering." + dt.name]: {} });
            return;
        }
        setStatus("location");
        setToggleStatus(true);
        updateToDB({ ["status." + dt.name]: "location", ["locationFiltering." + dt.name + ".radius"]: radius, ["locationFiltering." + dt.name + ".longitude"]: pickedLocation.longitude, ["locationFiltering." + dt.name + ".latitude"]: pickedLocation.latitude, ["locationFiltering." + dt.name + ".latitudeDelta"]: pickedLocationDelta.latitudeDelta, ["locationFiltering." + dt.name + ".longitudeDelta"]: pickedLocationDelta.longitudeDelta });
    };

    const back = () => {
        navigation.navigate("Overview", { email: email });
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1, overflow: "scroll" }}>
            <KeyboardAvoidingView behavior="position">
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
                <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "#000000", fontSize: 15, alignSelf: "center" }}>Time</Text>
                        <Switch
                            style={{ alignSelf: "center" }}
                            trackColor={{ true: "#128300", false: "#3D3D3D" }}
                            thumbColor={"#F5F5F5"}
                            onValueChange={handleTimeToggleStatus}
                            value={timeToggleStatus}
                        />
                    </View>
                    {showTimeSetting ?
                        <View style={{ marginTop: 5 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Text style={{ fontSize: 15, color: "#000000", alignSelf: "center" }}>Do not collect from</Text>
                                <TouchableOpacity style={{ marginHorizontal: 10, alignSelf: "center" }} onPress={handleShowTimePicker1}>
                                    <View style={{ backgroundColor: "#D9D9D9", height: 25, width: 50, justifyContent: "center" }}>
                                        {timePicker1 ?
                                            <Text style={{ alignSelf: "center", color: "#000000" }}>
                                                {timePicker1.getHours().toString().padStart(2, "0") + ":" + timePicker1.getMinutes().toString().padStart(2, "0")}
                                            </Text>
                                            :
                                            <></>
                                        }
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={showTimePicker1}
                                        mode="time"
                                        onConfirm={handleTimePicker1Confirm}
                                        onCancel={handleShowTimePicker1}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 15, color: "#000000", alignSelf: "center" }}>to</Text>
                                <TouchableOpacity style={{ marginHorizontal: 10, alignSelf: "center" }} onPress={handleShowTimePicker2}>
                                    <View style={{ backgroundColor: "#D9D9D9", height: 25, width: 50, justifyContent: "center" }}>
                                        {timePicker2 ?
                                            <Text style={{ alignSelf: "center", color: "#000000" }}>
                                                {timePicker2.getHours().toString().padStart(2, "0") + ":" + timePicker2.getMinutes().toString().padStart(2, "0")}
                                            </Text>
                                            :
                                            <></>
                                        }
                                    </View>
                                    <DateTimePickerModal
                                        isVisible={showTimePicker2}
                                        mode="time"
                                        onConfirm={handleTimePicker2Confirm}
                                        onCancel={handleShowTimePicker2}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 5, marginBottom: 15, alignSelf: "center" }}>
                                <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: "#128300" }} onPress={applyTimeSetting}>
                                    <Text style={{ color: "#FFFFFF" }}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <></>
                    }
                </View>
                <View>
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
                    {showLocationSetting ?
                        <View style={{ marginHorizontal: 15, marginTop: 5 }}>
                            <MapView
                                style={{ height: 200, width: "100%" }}
                                region={{
                                    latitude: pickedLocation.latitude,
                                    longitude: pickedLocation.longitude,
                                    latitudeDelta: pickedLocationDelta.latitudeDelta,
                                    longitudeDelta: pickedLocationDelta.longitudeDelta,
                                }}
                                onPanDrag={handleOnPanDrag}
                                onRegionChangeComplete={handleRegionChange}
                            />
                            <FakeMarker dragging={dragging}></FakeMarker>
                            <View style={{ flexDirection: "row", marginTop: 5, justifyContent: "space-around", alignItems: "center" }}>
                                <View>
                                    <Text style={{ fontSize: 15, color: "#000000", alignSelf: "center" }}>Do not collect when I'm within</Text>
                                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                                        <View style={{ backgroundColor: "#D9D9D9", height: 25, width: 50, justifyContent: "center", marginRight: 10 }}>
                                            <TextInput
                                                style={{ paddingVertical: 0 }}
                                                keyboardType="number-pad"
                                                onChangeText={(value) => handleRadius(value)}
                                                value={radius}
                                            />
                                        </View>
                                        <Text style={{ fontSize: 15, color: "#000000", alignSelf: "center" }}>m from this point</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: "#128300" }} onPress={applyLocationSetting}>
                                    <Text style={{ color: "#FFFFFF" }}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <></>
                    }
                </View>
                <View style={{ marginTop: 10, marginBottom: 20, alignSelf: "center" }}>
                    <TouchableOpacity style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F3F2F2" }} onPress={back}>
                        <Text style={{ color: "#000000" }}>Back</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}