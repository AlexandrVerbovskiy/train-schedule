import React from "react";
import { formatTime } from "../../utils/format";
import { TRAIN_TYPE_LABELS } from "../../statics";
import { Star } from "lucide-react";

const ScheduleRow = ({ routePoint, onToggleFavorite }) => (
  <tr className="transition-colors group border-b border-white/5 last:border-0 hover:bg-white/5">
    <td className="px-8 py-5 font-bold">
      <div className="flex items-center gap-4">
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(routePoint.id)}
            className={`transition-all duration-300 shrink-0 ${
              routePoint.isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-700 hover:text-slate-400"
            }`}
            title={routePoint.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={18} strokeWidth={routePoint.isFavorite ? 2.5 : 2} />
          </button>
        )}
        <span className="text-blue-400 font-bold">
          {routePoint.train?.trainNumber}
        </span>
      </div>
    </td>
    <td className="px-8 py-5">
      <span className="text-xs font-bold text-slate-500 opacity-60">
        {TRAIN_TYPE_LABELS[routePoint.train?.type]}
      </span>
    </td>
    <td className="px-8 py-5 font-bold text-white text-lg">
      {routePoint.station?.name}
    </td>
    <td className="px-8 py-5 font-bold text-slate-400">
      {formatTime(routePoint.arrivalHour, routePoint.arrivalMinute, "end")}
    </td>
    <td className="px-8 py-5 font-bold text-blue-400">
      {formatTime(routePoint.departureHour, routePoint.departureMinute, "start")}
    </td>
    <td className="px-8 py-5 text-sm font-bold text-slate-500 truncate max-w-[150px]">
      {routePoint.train?.name}
    </td>
  </tr>
);

export default ScheduleRow;
