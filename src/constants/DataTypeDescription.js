const RESEARCHER_CONTACT = 'nicol90820@kse.kaist.ac.kr';

const ACCESS_DESCRIPTION = `Who can access?\nResearchers from ICLab, KAIST\n(${RESEARCHER_CONTACT})`;

const DATATYPE_DESCRIPTION = {
  bluetooth: {
    description: `Why is it collected?\nTo analyse the relationship between the bluetooth data and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  wifi: {
    description: `Why is it collected?\nTo analyse the relationship between the wifi data and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  battery: {
    description: `Why is it collected?\nTo analyse the relationship between the status and the level of the batter and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  data_traffic: {
    description: `Why is it collected?\nTo analyse the relationship between the data traffic (amount of data bytes flowing in and out of the phone) and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  device_event: {
    description: `Why is it collected?\nTo analyse the relationship between the device event and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  message: {
    description: `Why is it collected?\nTo analyse the relationship between the amount of the messages that the users received or sent and their mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  call_log: {
    description: `Why is it collected?\nTo analyse the relationship between the number of calls that the users made or received and their mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  installed_app: {
    description: `Why is it collected?\nTo analyse the relationship between the number and kind of application that the users installed and their mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  location: {
    description: `Why is it collected?\nTo analyse the relationship between the amount and location of the places that the users visited and their mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  fitness: {
    description: `Why is it collected?\nTo analyse the relationship between the users' movement and motion data(step count, calories, and travelled distance) and their mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  physical_activity: {
    description: `Why is it collected?\nTo analyse the relationship between the physical activity and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  physical_activity_transition: {
    description: `Why is it collected?\nTo analyse the relationship between the physical activity transition and the users' mental health.\nTo validate the correctness of the physical activity data.\n\n${ACCESS_DESCRIPTION}`,
  },
  media: {
    description: `Why is it collected?\nTo analyse the relationship between the amount and the time of the video/photo taken and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  app_usage_event: {
    description: `Why is it collected?\nTo analyse the relationship between the app usage event and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  notification: {
    description: `Why is it collected?\nTo analyse the relationship between the app notification and the users' mental health.\n\n${ACCESS_DESCRIPTION}`,
  },
  survey: {
    description: `Why is it collected?\nTo act as a ground truth of the users' mental health to the study.\n\n${ACCESS_DESCRIPTION}`,
  },
};

export {DATATYPE_DESCRIPTION};
