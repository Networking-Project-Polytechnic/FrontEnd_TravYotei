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

// Creation of packages
export const create_package = async (packageData: {}) => {}