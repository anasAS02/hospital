export const BASE_URL = 'https://hospital-psi-two.vercel.app';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/signup`,
  
  // Patient
  PATIENTS: `${BASE_URL}/patient`,
  PATIENT_BY_ID: (id) => `${BASE_URL}/patient/${id}`,
  
  // Queue
  QUEUE: `${BASE_URL}/queue`,
  QUEUE_BY_ID: (id) => `${BASE_URL}/queue/${id}`,
  
  // Laboratory
  TESTS: `${BASE_URL}/tests`,
  TEST_ORDERS: `${BASE_URL}/testOrder`,
  TEST_ORDER_BY_ID: (id) => `${BASE_URL}/testOrder/${id}`,
  
  // Doctor
  MEDICAL_RECORDS: `${BASE_URL}/medicalRecords`,
  MEDICAL_RECORD_BY_ID: (id) => `${BASE_URL}/medicalRecords/${id}`,
  
  // Pharmacy
  MEDICATIONS: `${BASE_URL}/medication`,
  PHARMACY: `${BASE_URL}/pharmacy`,
  
  // Clinics
  CLINICS: `${BASE_URL}/clinics`,
  
  // Users
  USERS: `${BASE_URL}/users`,
  USER_BY_ID: (id) => `${BASE_URL}/users/${id}`,
  
  // Tickets
  TICKETS: `${BASE_URL}/ticket`,
  TICKET_BY_ID: (id) => `${BASE_URL}/ticket/${id}`,
};

export default API_ENDPOINTS;
