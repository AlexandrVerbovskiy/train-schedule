import React, { useState, useEffect, useCallback } from "react";
import * as scheduleApi from "../api/schedule";
import CustomTable from "../components/Common/CustomTable";
import ScheduleRow from "../components/Schedule/ScheduleRow";
import ScheduleFilters from "../components/Schedule/ScheduleFilters";

const ITEMS_PER_PAGE = 10;

const SchedulePage = () => {
  const [trains, setTrains] = useState([]);
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
      });
      setTrains(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Failed to load schedule");
    }
    setLoading(false);
  }, [page, search, targetType, targetTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchedule();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSchedule]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto h-full">
      <CustomTable
        title="Live Schedule"
        headerActions={
          <ScheduleFilters
            search={search}
            onSearchChange={(val) => { setSearch(val); setPage(1); }}
            targetType={targetType}
            onTypeChange={(val) => { setTargetType(val); setPage(1); }}
            targetTime={targetTime}
            onTimeChange={(val) => { setTargetTime(val); setPage(1); }}
          />
        }
        headers={["Num", "Type", "Station", "Arrival", "Departure", "Service"]}
        items={trains}
        emptyText="No trains found"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        renderRow={(routePoint) => (
          <ScheduleRow key={routePoint.id} routePoint={routePoint} />
        )}
      />
    </div>
  );
};

export default SchedulePage;
