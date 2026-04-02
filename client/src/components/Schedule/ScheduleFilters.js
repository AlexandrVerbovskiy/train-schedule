import React from "react";
import Input from "../Common/Input";
import CustomSelect from "../Common/CustomSelect";
import CustomTimeInput from "../Common/CustomTimeInput/CustomTimeInput";
import { TRAIN_TYPE_OPTIONS } from "../../statics";

const ScheduleFilters = ({
  search,
  onSearchChange,
  targetType,
  onTypeChange,
  targetTime,
  onTimeChange,
}) => (
  <div className="flex flex-row gap-4 items-center w-full max-w-2xl px-2">
    <div className="flex-1 min-w-0">
      <Input
        placeholder="Search station, train..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-12 bg-white/5 rounded-xl border border-white/10 w-full text-sm px-4"
      />
    </div>

    <div className="w-40 min-w-max">
      <CustomSelect
        value={targetType}
        onChange={onTypeChange}
        options={[{ label: "All Types", value: "" }, ...TRAIN_TYPE_OPTIONS]}
        isClearable={true}
      />
    </div>

    <div className="w-32 min-w-max">
      <CustomTimeInput value={targetTime} onChange={onTimeChange} />
    </div>
  </div>
);

export default ScheduleFilters;
