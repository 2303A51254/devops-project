import { http } from './http';

export const authApi = {
  login: (payload) => http.post('/auth/login', payload),
  signup: (payload) => http.post('/auth/signup', payload),
  me: (token) => http.get('/auth/me', token),
};

export const roomApi = {
  list: (query = '') => http.get(`/rooms${query ? `?${query}` : ''}`),
  details: (slug) => http.get(`/rooms/${slug}`),
  availability: (query) => http.get(`/rooms/availability?${query}`),
  create: (payload, token) => http.post('/rooms', payload, token),
  update: (id, payload, token) => http.put(`/rooms/${id}`, payload, token),
  remove: (id, token) => http.delete(`/rooms/${id}`, token),
};

export const bookingApi = {
  create: (payload, token) => http.post('/bookings', payload, token),
  mine: (token) => http.get('/bookings/mine', token),
  list: (token) => http.get('/bookings', token),
  update: (id, payload, token) => http.patch(`/bookings/${id}`, payload, token),
};

export const adminApi = {
  dashboard: (token) => http.get('/admin/dashboard', token),
  customers: (token) => http.get('/admin/customers', token),
  content: (token) => http.get('/admin/content', token),
  publicContent: () => http.get('/admin/content/public'),
  updateContent: (payload, token) => http.put('/admin/content', payload, token),
  availabilityList: (token) => http.get('/admin/availability', token),
  upsertAvailability: (payload, token) => http.post('/admin/availability', payload, token),
  deleteAvailability: (id, token) => http.delete(`/admin/availability/${id}`, token),
};
