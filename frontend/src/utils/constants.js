export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    PROFILE: '/auth/profile',
  },
  SYMPTOMS: {
    ANALYZE: '/symptoms/analyze',
    LIST: '/symptoms/list',
    EMERGENCY_CHECK: '/symptoms/emergency-check',
  },
  HOSPITALS: {
    SEARCH: '/hospitals/search',
    NEARBY: '/hospitals/nearby',
    EMERGENCY: '/hospitals/emergency',
    DETAILS: '/hospitals',
  },
};

export const EMERGENCY_NUMBERS = {
  INDIA: {
    EMERGENCY: '108',
    AMBULANCE: '102',
    POLICE: '100',
    FIRE: '101',
  },
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const URGENCY_LEVELS = {
  LOW: { color: 'green', text: 'Low Priority' },
  MEDIUM: { color: 'yellow', text: 'Medium Priority' },
  HIGH: { color: 'red', text: 'High Priority - Seek Immediate Care' },
};

export const LANGUAGES = [
  { code: 'english', name: 'English', native: 'English' },
  { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
];
