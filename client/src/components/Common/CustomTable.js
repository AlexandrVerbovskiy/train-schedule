import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CustomTable = ({
  title,
  headerActions,
  headers = [],
  items = [],
  renderRow,
  emptyText = "No records found",
  page = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) => (
  <div className="flex flex-col space-y-8 animate-in fade-in duration-300 h-full">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
      <div className="space-y-1">
        <h3 className="text-3xl md:text-4xl font-bold text-white shrink-0 tracking-tight">
          {title}
        </h3>
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3 sm:gap-4 justify-start sm:justify-end w-full sm:w-auto">
        {headerActions}
      </div>
    </div>

    {!loading && items.length > 0 && (
      <div>
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-slate-500 font-bold text-xs">
                {headers.map((header, idx) => (
                  <th key={idx} className="px-8 py-5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white font-medium divide-y divide-white/5">
              {items.map((item, index) => renderRow(item, index))}
            </tbody>
          </table>
        </div>

        {onPageChange && totalPages > 1 && (
          <div className="flex justify-center gap-3 pt-6">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-blue-600/10 hover:text-blue-400 rounded-2xl text-slate-400 transition-all border border-white/5 disabled:opacity-10 active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center px-6 h-12 bg-white/5 rounded-2xl border border-white/5 min-w-[60px] justify-center shadow-lg shadow-black/20">
              <span className="text-blue-500 font-bold text-sm leading-none">
                {page} <span className="opacity-30 mx-1">/</span>{" "}
                {totalPages || 1}
              </span>
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={loading || page >= (totalPages || 1)}
              className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-blue-600/10 hover:text-blue-400 rounded-2xl text-slate-400 transition-all border border-white/5 disabled:opacity-10 active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    )}

    {loading && (
      <div className="py-24 text-center">
        <div className="inline-block w-10 h-10 border-2 border-blue-600/10 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )}

    {!loading && items.length === 0 && (
      <div className="text-center opacity-10 select-none h-full flex items-center justify-center">
        <p className="font-bold text-sm">{emptyText}</p>
      </div>
    )}
  </div>
);

export default CustomTable;
