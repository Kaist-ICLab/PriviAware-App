import appUsageLog from './appUsageLog';

const appUsageData = appUsageLog;

const locationData = [
  {
    timestamp: 1689768165344,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119426,
    value: {
      latitude: 36.3942173,
      longitude: 127.3656169,
      altitude: 104.30000305175781,
      accuracy: 11.602999687194824,
      speed: 0.0,
    },
    datumType: 'LOCATION',
  },
  {
    timestamp: 1689768345361,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119426,
    value: {
      latitude: 36.3742036,
      longitude: 127.3655379,
      altitude: 104.4000015258789,
      accuracy: 13.1899995803833,
      speed: 0.0,
    },
    datumType: 'LOCATION',
  },
  {
    timestamp: 1689769823897,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119426,
    value: {
      latitude: 36.3542052,
      longitude: 127.3655981,
      altitude: 104.4000015258789,
      accuracy: 14.015999794006348,
      speed: 0.0,
    },
    datumType: 'LOCATION',
  },
  {
    timestamp: 1689770543947,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689773720864,
    value: {
      latitude: 36.3742021,
      longitude: 127.3955423,
      altitude: 104.4000015258789,
      accuracy: 13.572999954223633,
      speed: 0.0,
    },
    datumType: 'LOCATION',
  },
];

const batteryData = [
  {
    timestamp: 1689766594989,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'EG',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119555,
    value: {
      level: 90,
      scale: 100,
      temperature: 313,
      voltage: 4394,
      health: 'GOOD',
      pluggedType: 'USB',
      status: 'FULL',
      capacity: 100,
      chargeCounter: 3000000,
      currentAverage: -121,
      currentNow: -153,
      energyCounter: -9223372036854775808,
      technology: 'Li-ion',
    },
    datumType: 'BATTERY',
  },
  {
    timestamp: 1689766635941,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'EG',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119555,
    value: {
      level: 80,
      scale: 100,
      temperature: 318,
      voltage: 4410,
      health: 'GOOD',
      pluggedType: 'USB',
      status: 'FULL',
      capacity: 100,
      chargeCounter: 3000000,
      currentAverage: -3,
      currentNow: -151,
      energyCounter: -9223372036854775808,
      technology: 'Li-ion',
    },
    datumType: 'BATTERY',
  },
  {
    timestamp: 1689766666174,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119555,
    value: {
      level: 95,
      scale: 100,
      temperature: 314,
      voltage: 4333,
      health: 'GOOD',
      pluggedType: 'USB',
      status: 'FULL',
      capacity: 100,
      chargeCounter: 3000000,
      currentAverage: -7,
      currentNow: -6,
      energyCounter: -9223372036854775808,
      technology: 'Li-ion',
    },
    datumType: 'BATTERY',
  },
  {
    timestamp: 1689768480613,
    utcOffsetSec: 32400,
    subject: {
      groupName: 'PV',
      email: 'emily@kse.kaist.ac.kr',
      hashedEmail: 'b9d9a5270ad6c7c56c3be2804e1c3c47',
      instanceId: 'e7kWDa_tRLKdAGVJiTgSVt',
      source: 'SMARTPHONE',
      deviceManufacturer: 'samsung',
      deviceModel: 'SM-F711N',
      deviceVersion: '13',
      deviceOs: 'Android-33',
      appId: 'kaist.iclab.abclogger',
      appVersion: '0.9.9-omicron',
    },
    uploadTime: 1689770119555,
    value: {
      level: 80,
      scale: 100,
      temperature: 303,
      voltage: 4323,
      health: 'GOOD',
      pluggedType: 'USB',
      status: 'FULL',
      capacity: 100,
      chargeCounter: 3000000,
      currentAverage: 0,
      currentNow: -1,
      energyCounter: -9223372036854775808,
      technology: 'Li-ion',
    },
    datumType: 'BATTERY',
  },
];

export {locationData, appUsageData, batteryData};