export const ALERTBOX_MSG = {
  SUCCESS: 'Success',
  SUCCESSFUL_SIGNUP: 'Sign up successfully',
  ERROR: 'Error',
  EMPTY_FIELD: 'Please fill in all fields',
  EMPTY_PASSWORD: 'Please enter your password',
  WRONG_PASSWORD: 'Password does not match',
  DUPLICATED_EMAIL: 'This email has been used',
  INVALID_EMAIL: 'Please enter your email correctly',
  WRONG_INFORMATION: 'Incorrect email or password',
  SIGN_IN_FAILED: 'Sign in failed. Please try again',
};

export const PERMISSION_MSG = {
  WARNING: 'Warning',
  WARN_LOGOUT_CAUSE_LOCATION_FILTER_DOES_NOT_WORK:
    'Logging out will stop the location detecting in this application.\nLocation filtering setting might not be working as expected.\nAre you sure you want to logout?',
  WARN_LOCATION_PERMISSION:
    'Functions in this application require your location data. Some of the functions might not be accessible if you do not provide location data to this application.\n*You can always update this permission in Setting (Allow all the time).',
};

export const FILTER_MSG = {
  EMPTY_TIME: 'Please enter both starting time and ending time',
  EARLY_TIME_RANGE_ERROR: 'Starting time cannot be earlier than ending time',
  LATE_TIME_RANGE_ERROR: 'Starting time cannot be later than ending time',
  EMPTY_RADIUS: 'Please enter the distance',
  INVALID_RADIUS: 'Please enter an integer between 0 and 500',
  EMPTY_FILTER: 'Please turn on Location or Time filter',
};
