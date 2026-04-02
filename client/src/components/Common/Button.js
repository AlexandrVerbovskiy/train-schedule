import React from "react";
import clsx from "clsx";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`w-full py-4 font-bold rounded-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-tight text-sm ${className}`}
    >
      {children}
    </button>
  );
};

const PrimaryButton = ({ children, className = "", ...props }) => (
  <Button
    {...props}
    className={clsx(
      "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]",
      className,
    )}
  >
    {children}
  </Button>
);

const GhostButton = ({ children, className = "", ...props }) => (
  <Button
    {...props}
    className={clsx(
      "bg-white/10 hover:bg-white/20 text-white border border-white/10",
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
      "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30",
      className,
    )}
  >
    {children}
  </Button>
);

export { PrimaryButton, GhostButton, DangerButton };
