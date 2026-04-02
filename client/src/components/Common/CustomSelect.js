import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Check, X } from "lucide-react";

const CustomSelect = ({ value, onChange, options, isClearable = false }) => {
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative h-12">
          <Listbox.Button className="relative h-12 w-full cursor-pointer rounded-xl bg-white/5 border border-white/10 py-2 pl-4 pr-10 text-left text-white outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-blue-500/50 hover:bg-white/15 transition-all duration-300">
            <span className="block truncate font-medium text-sm">
              {selectedOption?.label || "Select..."}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown
                className="h-4 w-4 text-slate-500 transition-transform duration-300"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          {isClearable && value && (
            <div className="absolute inset-y-0 right-8 flex items-center z-10">
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-400 transition-all pointer-events-auto"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
          >
            <Listbox.Options 
              anchor="bottom start"
              className="mt-2 max-h-60 w-[var(--button-width)] overflow-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 py-2 text-base shadow-2xl focus:outline-none focus:ring-0 z-[9999]"
            >
              {options.map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active, selected }) =>
                    `relative cursor-pointer select-none py-3 pl-12 pr-4 transition-colors ${
                      active ? "bg-blue-600/20 text-blue-400" : "text-white"
                    } ${selected ? "text-blue-400" : ""}`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-bold" : "font-medium"}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
