import axios from 'axios';

const API_AUTH_URL = 'http://localhost:8181/api/v1';

const api_auth = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function parsePhoneValue(raw: unknown): number {
  if (raw === null || raw === undefined) {
    throw new Error('phoneNumber is required and must contain digits.');
  }
  const s = String(raw);
  const digits = s.replace(/\D/g, '');
  if (!digits) {
    throw new Error('phoneNumber must contain numeric digits.');
  }
  // If the number is too long for JS Number precision, consider sending as string
  return Number(digits);
}

// Login API (General)
export const login = async (userName: string, password: string) => {
  try {
    const response = await api_auth.post('/auth/login', {
      userName,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Signup API (Clients)
export const signup = async (userData: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string | number;
  address: string;
}) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      // ensure phoneNumber is numeric (backend expects a number)
      phoneNumber: parsePhoneValue(userData.phoneNumber),
      address: userData.address,
    };
    const response = await api_auth.post('/auth/client/register', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Signup API (Agencies)
export const signup_agency = async (userData: {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string | number;
  address: string;
  licenseNumber: string;
}) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
      phoneNumber: parsePhoneValue(userData.phoneNumber),
      address: userData.address,
      licenseNumber: userData.licenseNumber,
    };
    const response = await api_auth.post('/auth/agency/register', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login admin
export const login_admin = async (name: string, password: string) => {
  try {
    const response = await api_auth.post('/auth/admin/login', {
      name,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Admin signup
export const signup_admin = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api_auth.post('/auth/admin/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Api to get all agencies
const API_URL = 'http://localhost:8181/api/v1/agencies';
export const getAgencies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const getAgencyById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agency:', error);
    return null;
  }
};

// API functions for tracking
const TRACKING_API = 'http://localhost:8080/api/tracking';

export const getTrackingByCode = async (code: string) => {
  try {
    const response = await fetch(`${TRACKING_API}/code/${code}`);
    if (!response.ok) throw new Error('Tracking code not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return null;
  }
};

export const getTrackingHistory = async (busId: string) => {
  try {
    const response = await fetch(`${TRACKING_API}/${busId}`);
    if (!response.ok) throw new Error('History not found');
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

export const updateTracking = async (data: any) => {
  try {
    const response = await fetch(`${TRACKING_API}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating tracking:', error);
    return null;
  }
};

// Creation of packages
export const create_package = async (packageData: {}) => {}