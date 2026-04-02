import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = "" }) => (
  <div className="space-y-1">
    {label && <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>}
    <input 
      type={type} 
      value={value}
      onChange={onChange}
      className={`w-full bg-white/5 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium transition-all duration-150 ease-in-out ${className}`}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default Input;
