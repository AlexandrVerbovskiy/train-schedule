import React, { useState, useEffect, useCallback } from "react";
import * as scheduleApi from "../api/schedule";
import CustomTable from "../components/Common/CustomTable";
import ScheduleRow from "../components/Schedule/ScheduleRow";
import ScheduleFilters from "../components/Schedule/ScheduleFilters";
import * as favoritesApi from "../api/favorites";
import socketService from "../services/socketService";

const ITEMS_PER_PAGE = 10;

const SchedulePage = () => {
  const [routePoints, setRoutePoints] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const [hour, minute] = targetTime ? targetTime.split(":") : ["", ""];
      const { data, count } = await scheduleApi.getSchedule(page, {
        limit: ITEMS_PER_PAGE,
        search,
        type: targetType,
        hour,
        minute,
        showOnlyFavorites,
      });
      setRoutePoints(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Failed to load schedule");
    }
    setLoading(false);
  }, [page, search, targetType, targetTime, showOnlyFavorites]);

  useEffect(() => {
    setPage(1);
  }, [search, targetType, targetTime, showOnlyFavorites]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchedule();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchSchedule]);

  useEffect(() => {
    socketService.connect();
    socketService.on("TRAINS_UPDATED", fetchSchedule);
    socketService.on("STATIONS_UPDATED", fetchSchedule);

    return () => {
      socketService.off("TRAINS_UPDATED", fetchSchedule);
      socketService.off("STATIONS_UPDATED", fetchSchedule);
    };
  }, [fetchSchedule]);

  const handleToggleFavorite = async (routePointId) => {
    if (!routePointId) return;
    try {
      const { isFavorite } = await favoritesApi.toggleFavorite(routePointId);

      setRoutePoints((prev) =>
        prev.map((t) => (t.id === routePointId ? { ...t, isFavorite } : t)),
      );
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto h-full">
      <CustomTable
        title="Live Schedule"
        headerActions={
          <ScheduleFilters
            search={search}
            onSearchChange={setSearch}
            targetType={targetType}
            onTypeChange={setTargetType}
            targetTime={targetTime}
            onTimeChange={setTargetTime}
            showOnlyFavorites={showOnlyFavorites}
            onFavoritesToggle={setShowOnlyFavorites}
          />
        }
        headers={["Num", "Type", "Station", "Arrival", "Departure", "Service"]}
        items={routePoints}
        emptyText={showOnlyFavorites ? "No favorites yet" : "No route points found"}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        renderRow={(routePoint) => (
          <ScheduleRow
            key={routePoint.id}
            routePoint={routePoint}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      />
    </div>
  );
};

export default SchedulePage;
