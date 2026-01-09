// components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { loginUser } from "../api/auth";
import { useAuth } from "./AppContext";
import Toast from "./Toast";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!userEmail || !password) {
      setErr("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ userEmail, password });
      const token = res?.accessToken || res?.token || res?.data?.accessToken;

      if (!token) throw new Error("No token returned from server");

      await auth.login(token);
      showToast("Login successful! Redirecting...", "success");

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Login failed";
      setErr(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-[420px] border border-slate-700/50">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Lock className="text-slate-900" size={28} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-slate-400 mb-8">
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
                setErr("");
              }}
              className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPwd(e.target.value);
                setErr("");
              }}
              className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {err && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="text-red-400" size={16} />
              <p className="text-sm text-red-400">{err}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="px-4 text-slate-500 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-400 font-semibold hover:text-amber-300 hover:underline transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
