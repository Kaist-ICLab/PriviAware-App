const DATATYPE = [
  {
    name: 'app_usage_event',
    field: [{name: 'name', type: 'cat'}],
    sensitivity: true,
    icon: 'cellphone',
  },
  {
    name: 'call_log',
    field: [{name: 'type', type: 'cat'}],
    sensitivity: true,
    icon: 'phone',
  },
  {
    name: 'location',
    field: [{name: 'speed', type: 'num'}],
    sensitivity: true,
    icon: 'map-marker-radius',
  },
  {
    name: 'media',
    field: [{name: 'mimeType', type: 'cat'}],
    sensitivity: true,
    icon: 'image-outline',
  },
  {
    name: 'message',
    field: [{name: 'messageBox', type: 'cat'}],
    sensitivity: true,
    icon: 'email-outline',
  },
  {
    name: 'notification',
    field: [{name: 'name', type: 'cat'}],
    sensitivity: true,
    icon: 'bell-badge-outline',
  },
  {
    name: 'battery',
    field: [{name: 'level', type: 'num'}],
    sensitivity: false,
    icon: 'battery-80',
  },
  {
    name: 'bluetooth',
    field: [{name: 'bondState', type: 'cat'}],
    sensitivity: false,
    icon: 'bluetooth',
  },
  {
    name: 'data_traffic',
    field: [
      {name: 'rxBytes', type: 'num'},
      {name: 'txBytes', type: 'num'},
    ],
    sensitivity: false,
    icon: 'transfer',
  },
  {
    name: 'device_event',
    field: [{name: 'type', type: 'cat'}],
    sensitivity: false,
    icon: 'exclamation-thick',
  },
  {
    name: 'installed_app',
    field: [{name: 'numOfApps', type: 'count'}],
    sensitivity: false,
    icon: 'download',
  },
  {
    name: 'wifi',
    field: [{name: 'numOfAP', type: 'count'}],
    sensitivity: false,
    icon: 'wifi',
  },
  // no collected data from ABCLogger is found for below data type
  // { name: "physical_activity", field: [{ name: "type", type: "cat" }], sensitivity: false },                           // showFewEntries from CategoricalGraph is not compactible for this datatype
  // { name: "physical_activity_transition", field: [{ name: "type", type: "cat" }], sensitivity: false },
  // { name: "fitness", field: ["stepCount", "calories", "distance"] },
  // { name: "survey", field: ["isEntered"] }
];

const SENSITIVE_DATATYPE = DATATYPE.filter(dt => dt.sensitivity);
const NORMAL_DATATYPE = DATATYPE.filter(dt => !dt.sensitivity);

export {DATATYPE, SENSITIVE_DATATYPE, NORMAL_DATATYPE};
