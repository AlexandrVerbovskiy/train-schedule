import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { TRAIN_TYPE_LABELS } from "../../../statics";

const TrainRow = ({ train, onDelete, onEdit }) => (
  <tr className="transition-colors group border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
    <td className="px-8 py-5 text-slate-500 font-bold text-xs font-mono">
      {train.id.slice(0, 8)}
    </td>
    <td className="px-8 py-5 font-bold text-blue-400">#{train.trainNumber}</td>
    <td className="px-8 py-5 font-bold text-white text-sm">{train.name}</td>
    <td className="px-8 py-5">
      <span className="px-2.5 py-1 text-slate-400 rounded-lg text-sm font-bold">
        {TRAIN_TYPE_LABELS[train.type]}
      </span>
    </td>
    <td className="px-8 py-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-400 whitespace-nowrap">
          {train.routeItems?.length || 0} Stops
        </span>
      </div>
    </td>
    <td className="px-8 py-5 text-right">
      <div className="flex justify-end gap-1">
        <button
          onClick={() => onEdit(train)}
          className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          title="Edit Train"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(train.id)}
          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          title="Delete Train"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default TrainRow;
