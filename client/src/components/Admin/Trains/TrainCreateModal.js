import React, { useState } from "react";
import Modal from "../../Common/Modal/Modal";
import Input from "../../Common/Input";
import CustomSelect from "../../Common/CustomSelect";
import CustomTimeInput from "../../Common/CustomTimeInput/CustomTimeInput";
import { ActionButton, GhostButton } from "../../Common/Button";
import { Plus, X } from "lucide-react";
import { TRAIN_TYPE_OPTIONS } from "../../../statics";

const TrainCreateModal = ({
  isOpen,
  onClose,
  onCreate,
  stations: stationsProp = [],
  loading,
  initialData = null,
  error = "",
}) => {
  const [trainNumber, setTrainNumber] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("passenger");
  const [routeItems, setRouteItems] = useState([]);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTrainNumber(initialData.trainNumber || "");
        setName(initialData.name || "");
        setType(initialData.type || "passenger");
        setRouteItems(
          (initialData.routeItems || []).map((ri) => ({
            stationId: ri.station?.id || ri.stationId,
            arrivalTime:
              ri.arrivalHour !== undefined
                ? `${ri.arrivalHour.toString().padStart(2, "0")}:${ri.arrivalMinute.toString().padStart(2, "0")}`
                : "",
            departureTime:
              ri.departureHour !== undefined
                ? `${ri.departureHour.toString().padStart(2, "0")}:${ri.departureMinute.toString().padStart(2, "0")}`
                : "",
            order: ri.order,
          })),
        );
      } else {
        setTrainNumber("");
        setName("");
        setType("passenger");
        setRouteItems([]);
      }
    }
  }, [isOpen, initialData]);

  const stations = Array.isArray(stationsProp)
    ? stationsProp
    : stationsProp?.data || [];

  const handleAddRoutePoint = () => {
    setRouteItems([
      ...routeItems,
      {
        stationId: stations[0]?.id || "",
        arrivalTime: "",
        departureTime: "",
        order: routeItems.length + 1,
      },
    ]);
  };

  const updateRouteItem = (index, field, value) => {
    const updated = [...routeItems];
    updated[index][field] = value;
    setRouteItems(updated);
  };

  const removeRouteItem = (index) => {
    setRouteItems(routeItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ trainNumber, name, type, routeItems }, initialData?.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Train" : "Create Train"}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-full max-h-[80vh]"
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 pl-2">
                Train Number
              </label>
              <Input
                placeholder="e.g. 705"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                className="h-12 bg-white/5 rounded-xl border border-white/5 text-sm ring-blue-500/20 focus:ring-2 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 pl-2">
                Route Name
              </label>
              <Input
                placeholder="e.g. Kyiv - Lviv"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-white/5 rounded-xl border border-white/5 text-sm ring-blue-500/20 focus:ring-2 transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 pl-2">
                Fleet Category
              </label>
              <CustomSelect
                value={type}
                onChange={setType}
                options={TRAIN_TYPE_OPTIONS}
              />
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center px-2">
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Route Points Builder</h4>
                <p className="text-sm text-slate-500 font-bold">
                  Define the sequence of stops and timings
                </p>
              </div>
              <ActionButton type="button" onClick={handleAddRoutePoint}>
                <Plus size={14} strokeWidth={3} />
                Add Stop
              </ActionButton>
            </div>

            {routeItems.length > 0 && (
              <div className="space-y-4">
                {routeItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative bg-white/[0.03] rounded-[2rem] border border-white/5 p-6 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
                  >
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20">
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold">Route Point</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRouteItem(index)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 pl-3">
                          Station
                        </label>
                        <CustomSelect
                          value={item.stationId}
                          onChange={(val) =>
                            updateRouteItem(index, "stationId", val)
                          }
                          options={stations.map((s) => ({
                            label: s.name,
                            value: s.id,
                          }))}
                          isClearable={true}
                        />
                      </div>

                      <div className="flex flex-wrap gap-4 items-end">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 pl-3">
                            Arrival
                          </label>
                          <CustomTimeInput
                            value={item.arrivalTime}
                            onChange={(val) =>
                              updateRouteItem(index, "arrivalTime", val)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 pl-3">
                            Departure
                          </label>
                          <CustomTimeInput
                            value={item.departureTime}
                            onChange={(val) =>
                              updateRouteItem(index, "departureTime", val)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs font-bold text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <ActionButton
            type="submit"
            disabled={loading}
            className="flex-1 font-bold"
          >
            {loading ? "Saving..." : "Save"}
          </ActionButton>
          <GhostButton
            type="button"
            onClick={onClose}
            className="flex-1 font-bold"
          >
            Cancel
          </GhostButton>
        </div>
      </form>
    </Modal>
  );
};

export default TrainCreateModal;
