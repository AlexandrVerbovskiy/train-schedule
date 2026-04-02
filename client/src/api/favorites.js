import apiClient from "../utils/client";

export const toggleFavorite = (routePointId) =>
  apiClient(`/favorites/${routePointId}/toggle`, { method: "POST" });
