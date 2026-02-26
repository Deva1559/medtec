import api from './client';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  demoLogin: (data) => api.post('/auth/demo-login', data),

  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout')
};

export const aiAPI = {
  predictDisease: (data) => api.post('/ai/predict-disease', data),
  predictSeverity: (data) => api.post('/ai/predict-severity', data),
  getHealthScore: (data) => api.post('/ai/health-score', data),
  getSymptoms: () => api.get('/ai/symptoms'),
  chat: (data) => api.post('/ai/chat', data)
};


export const campAPI = {
  getAllCamps: (params) => api.get('/camps', { params }),
  createCamp: (data) => api.post('/camps', data),
  getCamp: (id) => api.get(`/camps/${id}`),
  updateCamp: (id, data) => api.put(`/camps/${id}`, data),
  deleteCamp: (id) => api.delete(`/camps/${id}`),
  registerPatient: (id) => api.post(`/camps/${id}/register`, {}),
  findNearbyCamps: (params) => api.get('/camps/nearby', { params })
};

export const emergencyAPI = {
  createEmergency: (data) => api.post('/emergencies', data),
  getEmergencies: (params) => api.get('/emergencies', { params }),
  getEmergency: (id) => api.get(`/emergencies/${id}`),
  updateStatus: (id, data) => api.put(`/emergencies/${id}/status`, data),
  assignDoctor: (id, data) => api.post(`/emergencies/${id}/assign-doctor`, data),
  getUserEmergencies: () => api.get('/emergencies/user/my-emergencies'),
  findNearby: (params) => api.get('/emergencies/nearby', { params })
};

export const ambulanceAPI = {
  getAllAmbulances: (params) => api.get('/ambulances', { params }),
  getAmbulance: (id) => api.get(`/ambulances/${id}`),
  updateLocation: (id, data) => api.put(`/ambulances/${id}/location`, data),
  updateStatus: (id, data) => api.put(`/ambulances/${id}/status`, data),
  findNearby: (params) => api.get('/ambulances/nearby', { params }),
  getTracking: (id) => api.get(`/ambulances/${id}/tracking`)
};

export const recordsAPI = {
  getAllRecords: (params) => api.get('/records', { params }),
  getPatientRecords: (patientId) => api.get(`/records/patient/${patientId}`),
  getRecord: (id) => api.get(`/records/${id}`),
  createRecord: (data) => api.post('/records', data),
  updateRecord: (id, data) => api.put(`/records/${id}`, data)
};

export const dashboardAPI = {
  getStats: (params) => api.get('/dashboard/stats', { params }),
  getHeatmap: () => api.get('/dashboard/heatmap'),
  getCampAnalytics: (campId) => api.get(`/dashboard/camp/${campId}/analytics`),
  getUserMetrics: () => api.get('/dashboard/user/metrics'),
  getTrends: () => api.get('/dashboard/trends/emergencies')
};

export const notificationAPI = {
  sendNotification: (data) => api.post('/notifications', data),
  getMyNotifications: (params) => api.get('/notifications/user/my-notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`, {}),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

export const volunteerAPI = {
  getAllVolunteers: () => api.get('/volunteers'),
  getVolunteer: (id) => api.get(`/volunteers/${id}`),
  registerAsVolunteer: (data) => api.post('/volunteers/register', data)
};
