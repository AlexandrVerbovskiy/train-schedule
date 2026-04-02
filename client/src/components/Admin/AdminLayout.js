import React from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="max-w-6xl w-full mx-auto p-6 space-y-10 min-h-screen bg-slate-950/50 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-3xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-10 border-b border-white/5">
        <div className="space-y-1">
          <Link to="/admin">
            <h1 className="text-4xl font-black text-white tracking-widest uppercase italic hover:text-blue-500 transition-colors">
              Admin Hub
            </h1>
          </Link>
        </div>

        <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <NavLink
            to="/admin/trains"
            className={({ isActive }) => 
              `px-8 py-3 rounded-xl font-black transition-all ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`
            }
          >
            Trains
          </NavLink>
          <NavLink
            to="/admin/stations"
            className={({ isActive }) => 
              `px-8 py-3 rounded-xl font-black transition-all ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`
            }
          >
            Stations
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-black border border-red-500/20 transition-all uppercase text-xs"
        >
          Logout
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
