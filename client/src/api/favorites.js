import apiClient from "../utils/client";

export const toggleFavorite = (trainId) =>
  apiClient(`/favorites/${trainId}/toggle`, { method: "POST" });
