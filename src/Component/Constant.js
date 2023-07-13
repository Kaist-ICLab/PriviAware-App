const DATATYPE = [
  {
    name: 'app_usage_event',
    field: [{name: 'name', type: 'cat'}],
    sensitivity: true,
  },
  {name: 'call_log', field: [{name: 'type', type: 'cat'}], sensitivity: true},
  {name: 'location', field: [{name: 'speed', type: 'num'}], sensitivity: true},
  {name: 'media', field: [{name: 'mimeType', type: 'cat'}], sensitivity: true},
  {
    name: 'message',
    field: [{name: 'messageBox', type: 'cat'}],
    sensitivity: true,
  },
  {
    name: 'notification',
    field: [{name: 'name', type: 'cat'}],
    sensitivity: true,
  },
  {name: 'battery', field: [{name: 'level', type: 'num'}], sensitivity: false},
  {
    name: 'bluetooth',
    field: [{name: 'bondState', type: 'cat'}],
    sensitivity: false,
  },
  {
    name: 'data_traffic',
    field: [
      {name: 'rxBytes', type: 'num'},
      {name: 'txBytes', type: 'num'},
    ],
    sensitivity: false,
  },
  {
    name: 'device_event',
    field: [{name: 'type', type: 'cat'}],
    sensitivity: false,
  },
  {
    name: 'installed_app',
    field: [{name: 'numOfApps', type: 'count'}],
    sensitivity: false,
  },
  {name: 'wifi', field: [{name: 'numOfAP', type: 'count'}], sensitivity: false},
  // no collected data from ABCLogger is found for below data type
  // { name: "physical_activity", field: [{ name: "type", type: "cat" }], sensitivity: false },                           // showFewEntries from CategoricalGraph is not compactible for this datatype
  // { name: "physical_activity_transition", field: [{ name: "type", type: "cat" }], sensitivity: false },
  // { name: "fitness", field: ["stepCount", "calories", "distance"] },
  // { name: "survey", field: ["isEntered"] }
];

const SENSITIVE_DATATYPE = DATATYPE.filter(dt => dt.sensitivity);
const NORMAL_DATATYPE = DATATYPE.filter(dt => !dt.sensitivity);

const COLOURS = [
  '#7b4173',
  '#a55194',
  '#ce6dbd',
  '#de9ed6',
  '#8c613c',
  '#ad7f4f',
  '#c89b67',
  '#e5c5a5',
  '#559867',
  '#70b182',
  '#90c69b',
  '#b8e0c6',
  '#9c6744',
  '#a56d5d',
  '#b37d6b',
  '#c1907c',
  '#d3a192',
  '#e0b7a6',
  '#5d5a6e',
  '#746f89',
  '#8c8aa3',
  '#a2a2bd',
  '#b8b8d6',
  '#c9c9e5',
  '#508082',
  '#67949c',
  '#80a8b4',
  '#9dc2cc',
  '#b8dceb',
  '#cfe5f7',
  '#8b4f4f',
  '#a15858',
  '#b76969',
  '#cc7f7f',
  '#e09393',
  '#eca7a7',
  '#50714f',
  '#66805d',
  '#7c926b',
  '#94a57a',
  '#acc78c',
  '#c5de9d',
  '#5a6e5d',
  '#6f8273',
  '#8aa38c',
  '#a2c1a2',
  '#b8d9b8',
  '#c9e5c9',
  '#584f8b',
  '#6758a1',
  '#7a6db8',
  '#8c80cc',
  '#a294e0',
  '#b8a7ec',
  '#81504f',
  '#936063',
  '#a87a7a',
  '#bc9191',
  '#d3a7a7',
  '#e0b8b8',
  '#515d5a',
  '#60736f',
];

export {DATATYPE, SENSITIVE_DATATYPE, NORMAL_DATATYPE, COLOURS};
