// components/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X, Mail } from "lucide-react";

const Toast = ({ message, type = "info", onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50",
      icon: <CheckCircle className="text-green-400" size={22} />,
      text: "text-green-300",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
      border: "border-red-500/50",
      icon: <XCircle className="text-red-400" size={22} />,
      text: "text-red-300",
    },
    info: {
      bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/50",
      icon: <Mail className="text-amber-400" size={22} />,
      text: "text-amber-300",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/50",
      icon: <AlertCircle className="text-yellow-400" size={22} />,
      text: "text-yellow-300",
    },
  };

  const style = config[type] || config.info;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl ${style.bg} ${style.border} border backdrop-blur-md shadow-2xl min-w-[300px]`}
      >
        {style.icon}
        <p className={`${style.text} font-medium flex-1`}>{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
