const DATATYPE = [
    { name: "bluetooth", field: ["eval_bondState"] },
    { name: "wifi", field: ["eval_numOfAP"] },
    { name: "battery", field: ["eval_level"] },
    { name: "data_traffic", field: ["eval_rxBytes", "eval_txBytes"] },
    { name: "device_event", field: ["eval_screenOn"] },
    { name: "message", field:["eval_messageBox"] },
    { name: "call_log", field: ["eval_type"] },
    { name: "installed_app", field: ["eval_numOfApps"] },
    { name: "location", field: ["eval_speed"] },
    { name: "fitness", field: ["eval_stepCount", "eval_calories", "eval_distance"] },
    { name: "physical_activity", field: ["eval_type"] },
    { name: "physical_activity_transition", field: ["eval_type"] },
    { name: "survey", field: ["eval_isEntered"] }
];

export { DATATYPE };