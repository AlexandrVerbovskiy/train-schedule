import React from "react";
import clsx from "clsx";

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={clsx(
      "px-6 flex items-center justify-center gap-2 rounded-2xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
      className,
    )}
  >
    {children}
  </button>
);

const GhostButton = ({ children, className = "", ...props }) => (
  <Button
    {...props}
    className={clsx(
      "h-14 bg-slate-900/40 text-white border border-white/10 hover:bg-slate-800 transition-all px-8",
      className,
    )}
  >
    {children}
  </Button>
);

const ActionButton = ({ children, className = "", ...props }) => (
  <Button
    {...props}
    className={clsx(
      "h-14 bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30",
      className,
    )}
  >
    {children}
  </Button>
);

const DangerButton = ({ children, className = "", ...props }) => (
  <Button
    {...props}
    className={clsx(
      "h-14 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-8",
      className,
    )}
  >
    {children}
  </Button>
);

export { GhostButton, DangerButton, ActionButton };
