import React from "react";
import { formatTime } from "../../utils/format";
import { TRAIN_TYPE_LABELS } from "../../statics";
import { Star } from "lucide-react";

const ScheduleRow = ({ train, onToggleFavorite }) => (
  <tr className="transition-all duration-300 group border-b border-white/5 last:border-0">
    <td className="px-8 py-6 font-bold align-top">
      <div className="flex items-center gap-4">
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(train.id)}
            className={`transition-all duration-300 shrink-0 ${
              train.isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-700 hover:text-slate-400"
            }`}
            title={
              train.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star size={18} strokeWidth={train.isFavorite ? 2.5 : 2} />
          </button>
        )}
        <span className="text-blue-400 text-xl tracking-wider font-black">
          {train.trainNumber}
        </span>
      </div>
    </td>
    <td className="px-8 py-6 align-top">
      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          {TRAIN_TYPE_LABELS[train.type]}
        </span>
      </div>
    </td>
    <td className="px-8 py-6 align-top">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-slate-400 line-clamp-2 leading-relaxed">
          {train.name}
        </span>
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="flex flex-col gap-6 relative">
        {train.routeItems?.map((rp, idx) => (
          <div
            key={rp.id}
            className="relative pl-10 group/item flex flex-col justify-center min-h-[40px]"
          >
            {idx < train.routeItems.length - 1 && (
              <div className="absolute left-[7px] top-[24px] bottom-[-24px] w-[2px] bg-gradient-to-b from-blue-500/30 to-blue-500/10 rounded-full" />
            )}

            <div
              className={`absolute left-0 top-[12px] w-[16px] h-[16px] rounded-full border-2 z-10 border-blue-500/40 bg-slate-900`}
            />

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="font-bold text-white">
                  {rp.station?.name}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {rp.arrivalHour !== null && rp.arrivalHour !== undefined && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase opacity-60">
                      Arr
                    </span>
                    <span className="font-mono font-bold text-slate-300">
                      {formatTime(rp.arrivalHour, rp.arrivalMinute)}
                    </span>
                  </div>
                )}

                {rp.departureHour !== null &&
                  rp.departureHour !== undefined && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <span className="text-[10px] font-bold text-blue-500/60 uppercase">
                        Dep
                      </span>
                      <span className="font-mono font-bold text-blue-400">
                        {formatTime(rp.departureHour, rp.departureMinute)}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </td>
  </tr>
);

export default ScheduleRow;
