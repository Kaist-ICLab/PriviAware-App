const DATATYPE = [
    { name: "bluetooth", field: ["bondState"] },
    { name: "wifi", field: ["numOfAP"] },
    { name: "battery", field: ["level"] },
    { name: "data_traffic", field: ["rxBytes", "txBytes"] },
    { name: "device_event", field: ["screenOn"] },
    { name: "message", field:["messageBox"] },
    { name: "call_log", field: ["type"] },
    { name: "installed_app", field: ["numOfApps"] },
    { name: "location", field: ["speed"] },
    { name: "fitness", field: ["stepCount", "calories", "distance"] },
    { name: "physical_activity", field: ["type"] },
    { name: "physical_activity_transition", field: ["type"] },
    { name: "survey", field: ["isEntered"] }
];

export { DATATYPE };