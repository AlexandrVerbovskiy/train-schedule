import React from "react";
import { formatTime } from "../../utils/format";
import { TRAIN_TYPE_LABELS } from "../../statics";

const ScheduleRow = ({ routePoint }) => (
  <tr className="transition-colors group border-b border-white/5 last:border-0">
    <td className="px-8 py-5 font-bold text-blue-400">
      {routePoint.train?.trainNumber}
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
