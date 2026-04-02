import React from "react";
import { Trash2, Pencil } from "lucide-react";

const StationRow = ({ station, onEdit, onDelete }) => (
  <tr className="transition-colors group border-b border-white/5 last:border-0">
    <td className="px-8 py-5 text-slate-500 font-bold text-xs font-mono">
      {station.id.slice(0, 8)}
    </td>
    <td className="px-8 py-5 font-bold text-white transition-colors">
      {station.name}
    </td>
    <td className="px-8 py-5 text-right w-32 pr-10">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(station)}
          className="p-2 text-slate-600 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-all"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(station.id)}
          className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default StationRow;
