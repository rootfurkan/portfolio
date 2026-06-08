import axios from 'axios';

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Request interceptor — her isteğe otomatik token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 gelirse logout yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  register:       (data) => api.post('/auth/register', data),
  me:             ()     => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Profile
export const profileAPI = {
  get:         ()     => api.get('/profile'),
  update:      (data) => api.put('/profile', data),
  uploadPhoto: (file) => {
    const form = new FormData();
    form.append('photo', file);
    return api.post('/profile/photo', form);
  }
};

// Projects
export const projectsAPI = {
  getAll: ()        => api.get('/projects'),
  getOne: (id)      => api.get(`/projects/${id}`),
  create: (data)    => api.post('/projects', data),
  update: (id, data)=> api.put(`/projects/${id}`, data),
  delete: (id)      => api.delete(`/projects/${id}`)
};

// Experiences
export const experiencesAPI = {
  getAll: ()        => api.get('/experiences'),
  create: (data)    => api.post('/experiences', data),
  update: (id, data)=> api.put(`/experiences/${id}`, data),
  delete: (id)      => api.delete(`/experiences/${id}`)
};

// Educations
export const educationsAPI = {
  getAll: ()        => api.get('/educations'),
  create: (data)    => api.post('/educations', data),
  update: (id, data)=> api.put(`/educations/${id}`, data),
  delete: (id)      => api.delete(`/educations/${id}`)
};

// Certificates
export const certificatesAPI = {
  getAll: ()        => api.get('/certificates'),
  create: (data)    => api.post('/certificates', data),
  update: (id, data)=> api.put(`/certificates/${id}`, data),
  delete: (id)      => api.delete(`/certificates/${id}`)
};

export default api;