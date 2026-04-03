import React from "react";
import Input from "../Common/Input";
import CustomSelect from "../Common/CustomSelect";
import CustomTimeInput from "../Common/CustomTimeInput/CustomTimeInput";
import { TRAIN_TYPE_OPTIONS } from "../../statics";
import { Star } from "lucide-react";

const ScheduleFilters = ({
  search,
  onSearchChange,
  targetType,
  onTypeChange,
  targetTime,
  onTimeChange,
  showOnlyFavorites,
  onFavoritesToggle,
}) => (
  <div className="flex flex-row gap-3 md:gap-4 items-center w-full max-w-4xl px-2">
    <div className="flex-1 min-w-0">
      <Input
        placeholder="Search station, train..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-12 bg-white/5 rounded-xl border border-white/10 w-full text-sm px-4"
      />
    </div>

    <button
      onClick={() => onFavoritesToggle(!showOnlyFavorites)}
      className={`h-12 px-3 md:px-5 flex items-center gap-2 rounded-xl text-sm font-bold transition-all border shrink-0 ${
        showOnlyFavorites
          ? "bg-yellow-400/10 text-yellow-400 border-yellow-500/20 shadow-lg shadow-yellow-500/5"
          : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-slate-300"
      }`}
    >
      <Star
        size={16}
        className={showOnlyFavorites ? "fill-yellow-400" : ""}
        strokeWidth={showOnlyFavorites ? 2.5 : 2}
      />
      <span className="hidden md:inline">Favorites</span>
    </button>

    <div className="w-40 min-w-max">
      <CustomSelect
        value={targetType}
        onChange={onTypeChange}
        options={[{ label: "All Types", value: "" }, ...TRAIN_TYPE_OPTIONS]}
      />
    </div>

    <div className="w-32 min-w-max">
      <CustomTimeInput value={targetTime} onChange={onTimeChange} />
    </div>
  </div>
);

export default ScheduleFilters;
