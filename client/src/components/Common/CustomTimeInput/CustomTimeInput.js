import React from "react";
import DatePicker from "react-datepicker";
import { Clock, X } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomTimeInput.css";

const CustomTimeInput = ({ value, onChange }) => {
  const getDateFromTime = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  const handleTimeChange = (date) => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      onChange(`${hours}:${minutes}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="relative group w-full md:w-36">
      <div className="absolute inset-y-0 right-3 flex items-center gap-2 z-20 pointer-events-none">
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange("");
            }}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-400 transition-all pointer-events-auto"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <Clock className="h-4 w-4 text-slate-500 transition-colors" />
      </div>
      <DatePicker
        selected={getDateFromTime(value)}
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        placeholderText="--:--"
        className="h-12 w-full bg-white/5 border border-white/10 rounded-xl px-4 text-white font-medium outline-none transition-all duration-300 hover:bg-white/15 focus:ring-2 focus:ring-blue-500/50 pr-12 text-sm cursor-pointer"
        popperClassName="premium-time-popper"
      />
    </div>
  );
};

export default CustomTimeInput;
