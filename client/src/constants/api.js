export const BASE_URL = 'https://hospital-psi-two.vercel.app';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/signup`,
  
  // Patient
  PATIENTS: `${BASE_URL}/patients`,
  PATIENT_BY_ID: (id) => `${BASE_URL}/patients/${id}`,
  
  // Queue
  QUEUE: `${BASE_URL}/queue`,
  QUEUE_BY_ID: (id) => `${BASE_URL}/queue/${id}`,
  
  // Laboratory
  TESTS: `${BASE_URL}/test-types`,
  TEST_ORDERS: `${BASE_URL}/test-orders`,
  TEST_ORDER_BY_ID: (id) => `${BASE_URL}/test-orders/${id}`,
  
  // Doctor
  MEDICAL_RECORDS: `${BASE_URL}/medicalRecords`,
  MEDICAL_RECORD_BY_ID: (id) => `${BASE_URL}/medicalRecords/${id}`,
  
  // Pharmacy
  MEDICATIONS: `${BASE_URL}/medications`,
  PHARMACY: `${BASE_URL}/prescriptions`,
  
  // Clinics
  CLINICS: `${BASE_URL}/clinics`,
  
  // Users
  USERS: `${BASE_URL}/users`,
  USER_BY_ID: (id) => `${BASE_URL}/users/${id}`,
  USER_INFO: `${BASE_URL}/users/info`,
  
  // Tickets
  TICKETS: `${BASE_URL}/tickets`,
  TICKET_BY_ID: (id) => `${BASE_URL}/tickets/${id}`,

  // Ads
  ADS: `${BASE_URL}/ads/`,
  ADD_AD: `${BASE_URL}/ads/add`,
  UPDATE_AD: `${BASE_URL}/ads/`,
  REMOVE_AD: `${BASE_URL}/ads/`,
};

export default API_ENDPOINTS;
