import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="space-y-1">
    {label && <label className="text-[10px] font-bold text-slate-500 ml-1 tracking-tight">{label}</label>}
    <input 
      type={type} 
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default Input;
