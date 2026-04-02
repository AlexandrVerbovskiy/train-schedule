import apiClient from "../utils/client";

export const getAllTrains = (page = 1, limit = 10, search = "") =>
  apiClient(`/trains?page=${page}&limit=${limit}&search=${search}`);

export const createTrain = (trainData) =>
  apiClient("/trains", { body: trainData });

export const updateTrain = (id, trainData) =>
  apiClient(`/trains/${id}`, { method: "PUT", body: trainData });

export const deleteTrain = (id) =>
  apiClient(`/trains/${id}`, { method: "DELETE" });