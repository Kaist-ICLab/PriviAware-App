const DATATYPE = [
    { name: "bluetooth", field: [{ name: "bondState", type: "cat" }] },
    { name: "wifi", field: [{ name: "numOfAP", type: "count" }] },
    { name: "battery", field: [{ name: "level", type: "num" }] },
    { name: "data_traffic", field: [{ name: "rxBytes", type: "num" }, { name: "txBytes", type: "num" }] },
    { name: "device_event", field: [{ name: "type", type: "cat" }] },
    { name: "message", field: [{ name: "messageBox", type: "cat" }] },
    { name: "call_log", field: [{ name: "type", type: "cat" }] },
    { name: "installed_app", field: [{ name: "numOfApps", type: "count" }] },
    { name: "location", field: [{ name: "speed", type: "num" }] },
    // { name: "fitness", field: ["stepCount", "calories", "distance"] },
    { name: "physical_activity", field: [{ name: "type", type: "cat" }] },
    { name: "physical_activity_transition", field: [{ name: "type", type: "cat" }] },
    // { name: "survey", field: ["isEntered"] }
];

export { DATATYPE };