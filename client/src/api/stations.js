import apiClient from './client';

export const getAllStations = () => apiClient('/stations');

export const createStation = (name) => apiClient('/stations', { body: { name } });

export const deleteStation = (id) => apiClient(`/stations/${id}`, { method: 'DELETE' });
