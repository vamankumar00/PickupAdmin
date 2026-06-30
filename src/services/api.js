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

// Response Interceptor for handling expiration (Sessions)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('[API] Unauthorized access detected. Redirecting to login...');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Helpers
export const login = async (credentials) => {
  return await api.post('/Auth/login', credentials);
};

// Employee Helpers
export const getEmployees = async (page = 1, pageSize = 10, search = '') => {
  return await api.get(`/Employees/paged?page=${page}&pageSize=${pageSize}&search=${search}`);
};

export const createEmployee = async (employeeData) => {
  return await api.post('/Employees', employeeData);
};

export const updateEmployee = async (id, employeeData) => {
  return await api.put(`/Employees/${id}`, employeeData);
};

export const deleteEmployee = async (id) => {
  return await api.delete(`/Employees/${id}`);
};

export const importEmployees = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/Employees/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getSampleExcel = async () => {
    const response = await api.get('/Employees/sample-excel', { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Employee_Import_Sample.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// Dashboard & Stats
export const getStats = async () => {
  return await api.get('/Dashboard/stats');
};

export default api;
