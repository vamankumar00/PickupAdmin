import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

// Auth Helpers
export const signIn = async (userName, password) => {
  return await api.post('/sign-in', { userName, password });
};

// Employee Helpers
export const getEmployees = async (page = 1, pageSize = 10, search = '') => {
  return await api.get(`/Employees?page=${page}&pageSize=${pageSize}&search=${search}`);
};

export const createEmployee = async (employeeData) => {
  return await api.post('/Employees', employeeData);
};

export const importEmployees = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/Employees/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Route Helpers
export const processRoutes = async (direction = 'Pickup') => {
  return await api.post(`/Routes/process-routes?direction=${direction}`);
};

export const getRoutes = async () => {
  return await api.get('/Routes');
};

// Dashboard Helpers
export const getStats = async () => {
  return await api.get('/Dashboard/stats');
};

// Auth Helpers
export const login = async (credentials) => {
  return await api.post('/Auth/login', credentials);
};

// Vehicle Helpers
export const getVans = async () => {
  return await api.get('/Vans');
};

export const getVanManifest = async (id) => {
  return await api.get(`/Vans/${id}/manifest`);
};

export default api;
