import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  Train,
  MapPin,
  Calendar,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import ConfirmModal from "./Modal/ConfirmModal";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isAdmin = user?.role === "admin";

  const routes = useMemo(() => {
    const res = [
      {
        path: "/",
        label: "Schedule",
        icon: Calendar,
      },
    ];

    if (isAdmin) {
      res.push(
        {
          path: "/admin/trains",
          label: "Trains",
          icon: Train,
        },
        {
          path: "/admin/stations",
          label: "Stations",
          icon: MapPin,
        },
      );
    }

    return res;
  }, [isAdmin]);

  return (
    <div className="max-w-6xl w-full mx-auto p-4 space-y-8 bg-slate-950/50 backdrop-blur-2xl rounded-4xl border border-white/5 shadow-3xl h-[90vh] flex flex-col overflow-y-auto">
      <div className="flex flex-row justify-between items-center px-4 md:px-6 py-3 bg-white/5 rounded-2xl border border-white/5 sticky top-0 z-40 backdrop-blur-3xl shadow-xl shadow-slate-950/20">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              ) : (
                <UserIcon className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <div className="hidden lg:block">
              <div className="text-[10px] font-bold text-slate-500 leading-none mb-1 uppercase tracking-wider">
                {user?.role} Mode
              </div>
              <div className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-white/10 hidden lg:block"></div>

          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm font-bold transition-all border shrink-0 ${
                    location.pathname === route.path
                      ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border-transparent"
                  }`
                }
              >
                <route.icon size={16} />
                <span className="hidden sm:inline-block">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ml-2 shrink-0"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Exit</span>
        </button>
      </div>

      <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2 pb-6">
        <Outlet />
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Signing Out"
        message="Are you sure you want to end your current session?"
        confirmText="Exit Session"
      />
    </div>
  );
};

export default MainLayout;
