import apiClient from '../utils/client';

export const getStations = (page = 1, limit = 10) => apiClient(`/stations?page=${page}&limit=${limit}`);
export const getAllStations = () => apiClient('/stations/all');

export const createStation = (name) => apiClient('/stations', { body: { name } });

export const updateStation = (id, name) => apiClient(`/stations/${id}`, { method: 'PUT', body: { name } });

export const deleteStation = (id) => apiClient(`/stations/${id}`, { method: 'DELETE' });
