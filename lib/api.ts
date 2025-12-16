import axios from 'axios';

const API_AUTH_URL = 'http://localhost:8181/api/v1';

const api_auth = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login API (General)
export const login = async (username: string, password: string) => {
  try {
    const response = await api_auth.post('/auth/login', {
      username,
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
  phoneNumber: string;
  address: string;
}) => {
  try {
    const response = await api_auth.post('/auth/client/register', userData);
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
  phoneNumber: string;
  address: string;
  licenseNumber: string;
}) => {
  try {
    const response = await api_auth.post('/auth/agency/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};