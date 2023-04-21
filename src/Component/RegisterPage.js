import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

import { SERVER_IP_ADDR, SERVER_PORT } from '@env';

export default function RegisterPage() {
    const navigation = useNavigation();
    const [showPW1, setShowPW1] = useState(false);
    const [showPW2, setShowPW2] = useState(false);
    const [emailValidity, setEmailValidity] = useState(false);
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const handleEmail = (value) => {
        if (value.includes("@")) setEmailValidity(true);
        else setEmailValidity(false);
        setEmail(value);
    };

    const handlePassword1 = (value) => {
        setPassword1(value);
    };

    const handlePassword2 = (value) => {
        setPassword2(value);
    };

    const handleShowPW1 = () => {
        setShowPW1(!showPW1);
    };

    const handleShowPW2 = () => {
        setShowPW2(!showPW2);
    };

    const AlertBox = (title, msg) => {
        Alert.alert(title, msg, [
            {
                text: "OK", style: "cancel"
            }
        ]);
    };

    const cancel = () => {
        navigation.navigate("Login");
    };

    const submit = async () => {
        if (!email || !password1 || !password2) {
            AlertBox("Error", "Please fill in every field");
            return;
        }
        console.log("[RN LoginPage.js] Email: " + email + " Password1: " + password1 + " Password2: " + password2);
        if (password1 !== password2) {
            AlertBox("Error", "Passwords do not match");
            return;
        }
        const res = await fetch("http://" + SERVER_IP_ADDR + ":" + SERVER_PORT + "/createuser", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password1 })
        });
        const data = await res.json();
        console.log("[RN App.js] Received: " + JSON.stringify(data));
        if (data.result) {
            AlertBox("Success", "Account created!");
            navigation.navigate("Login");
        } else AlertBox("Error", "Email is registered");
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#FEFFBE", flex: 1, justifyContent: "center" }}>
            <View style={{ justifyContent: "space-around" }}>
                <Text style={{ alignSelf: "center", color: "#000000", fontSize: 40 }}>Privacy-Viz</Text>
                <Text style={{ alignSelf: "center", color: "#000000", fontSize: 25, marginBottom: 40 }}>Registration</Text>
                <View style={{ backgroundColor: "#DBDBDB", marginHorizontal: 40 }}>
                    <Text style={{ marginTop: 10, marginLeft: 20, color: "#000000", fontSize: 17 }}>Gmail</Text>
                    <TextInput
                        style={{ backgroundColor: "#F3F2F2", marginHorizontal: 20, height: 30, paddingVertical: 0 }}
                        keyboardType="email-address"
                        onChangeText={(value) => handleEmail(value)}
                    />
                    {emailValidity ?
                        <></>
                        :
                        <Text style={{ color: "#ff0000", marginLeft: 20 }}>Invalid Email</Text>
                    }
                    <Text style={{ marginTop: 10, marginLeft: 20, color: "#000000", fontSize: 17 }}>Password</Text>
                    <View style={{ flexDirection: "row", marginHorizontal: 20, height: 30, backgroundColor: "#F3F2F2", alignItems: "center" }}>
                        <TextInput
                            style={{ paddingVertical: 0, width: "88%" }}
                            secureTextEntry={!showPW1}
                            onChangeText={(value) => handlePassword1(value)}
                        />
                        <TouchableOpacity onPress={handleShowPW1}>
                            {showPW1 ?
                                <Entypo name="eye-with-line" size={20}></Entypo>
                                :
                                <Entypo name="eye" size={20}></Entypo>
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10, marginLeft: 20, color: "#000000", fontSize: 17 }}>Confirm Password</Text>
                    <View style={{ flexDirection: "row", marginHorizontal: 20, height: 30, marginBottom: 20, backgroundColor: "#F3F2F2", alignItems: "center" }}>
                        <TextInput
                            style={{ paddingVertical: 0, width: "88%" }}
                            secureTextEntry={!showPW2}
                            onChangeText={(value) => handlePassword2(value)}
                        />
                        <TouchableOpacity onPress={handleShowPW2}>
                            {showPW2 ?
                                <Entypo name="eye-with-line" size={20}></Entypo>
                                :
                                <Entypo name="eye" size={20}></Entypo>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ backgroundColor: "#F3F2F2", flex: 1, justifyContent: "center" }} onPress={cancel}>
                            <Text style={{ alignSelf: "center", color: "#000000", fontSize: 15, marginVertical: 8 }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: "#E9EE02", flex: 1, justifyContent: "center" }} onPress={submit}>
                            <Text style={{ alignSelf: "center", color: "#000000", fontSize: 15 }}>Submit</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}