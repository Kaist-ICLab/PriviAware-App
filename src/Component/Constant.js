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

const COLOURS = ['#7b4173', '#a55194', '#ce6dbd', '#de9ed6', '#8c613c', '#ad7f4f', '#c89b67', '#e5c5a5', '#559867', '#70b182', '#90c69b', '#b8e0c6']

export { DATATYPE, COLOURS };