export const formatTime = (hour, minute, fallback = '-') => {
  if (hour === undefined || hour === null || minute === undefined || minute === null) return fallback;
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
};
