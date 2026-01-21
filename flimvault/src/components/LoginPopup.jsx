import React from "react";
import { Lock } from "lucide-react";

const LoginPopup = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Lock className="text-slate-900" size={24} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center">
          Login Required 🔒
        </h2>

        <p className="text-slate-400 text-center mt-2">
          Please login to view movie details.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onLogin}
            className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 hover:opacity-95 transition"
          >
            Login
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
