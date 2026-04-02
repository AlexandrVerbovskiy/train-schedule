import apiClient from './client';

export const getAllTrains = (page = 1, limit = 10) => 
  apiClient(`/trains?page=${page}&limit=${limit}`);

export const createTrain = (trainData) => 
  apiClient('/trains', { body: trainData });

export const deleteTrain = (id) => 
  apiClient(`/trains/${id}`, { method: 'DELETE' });

export const addRoutePoint = (routeData) => 
  apiClient('/route-points', { body: routeData });
