import React from "react";
import Login from "./Login";

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-3">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-slate-900/80 text-white w-8 h-8 rounded-full shadow-md hover:bg-slate-800 transition flex items-center justify-center"
        >
          ✕
        </button>

        {/* ✅ Only Login Card */}
        <Login isModal={true} />
      </div>
    </div>
  );
}

export default LoginModal;
