import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Helpers
export const login = async (credentials) => {
  return await api.post('/Auth/login', credentials);
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

export const getSampleExcel = async () => {
  const response = await api.get('/Employees/sample-excel', {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Employee_Import_Sample.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Vehicle Helpers
export const getVans = async (page = 1, pageSize = 10, search = '') => {
  return await api.get(`/Vans?page=${page}&pageSize=${pageSize}&search=${search}`);
};

export const getVanManifest = async (id) => {
  return await api.get(`/Vans/${id}/manifest`);
};

// Dashboard & Stats
export const getStats = async () => {
  return await api.get('/Dashboard/stats');
};

export default api;
