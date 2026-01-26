// components/RegistrationForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Check,
  AlertCircle,
  MapPin,
  ArrowLeft,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "./Toast";

// ✅ Firebase Google Auth
import { signInWithPopup } from "firebase/auth";
import { firebaseAuth, googleProvider } from "../api/firebase";
import { useAuth } from "./AppContext";

// ✅ Google image
import google from "../assets/google.png";

// const API = "http://localhost:8086/api/auth";
const API = "https://s-movies-nlo8.onrender.com/api/auth";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("register");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    userEmail: "",
    password: "",
    fullName: "",
    address: "",
    countryCode: "+91",
    phone: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const showToastMsg = (message, type) => setToast({ message, type });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setErrorMsg("");
  };

  const validateForm = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.username.trim()) e.username = "Username is required";
    if (!formData.userEmail.trim()) e.userEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.userEmail))
      e.userEmail = "Invalid email format";
    if (!formData.password.trim()) e.password = "Password is required";
    else if (formData.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendOtp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(`${API}/send-otp`, { email: formData.userEmail });
      setStep("otp");
      setTimer(60);
      showToastMsg(`OTP sent to ${formData.userEmail}`, "info");
    } catch (e) {
      const msg = e.response?.data?.message || "Failed to send OTP";
      setErrorMsg(msg);
      showToastMsg(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      await axios.post(`${API}/send-otp`, { email: formData.userEmail });
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      showToastMsg("OTP resent successfully!", "info");
    } catch (e) {
      const msg = e.response?.data?.message || "Failed to resend OTP";
      setErrorMsg(msg);
      showToastMsg(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const copy = [...otp];
    copy[index] = value.slice(-1);
    setOtp(copy);
    if (value && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const verifyOtp = async () => {
    if (otp.join("").length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      showToastMsg("Please enter a valid 6-digit OTP", "warning");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/verify-otp`, {
        email: formData.userEmail,
        otp: otp.join(""),
      });

      await axios.post(`${API}/register`, {
        username: formData.username,
        email: formData.userEmail,
        password: formData.password,
        fullName: formData.fullName,
        address: formData.address || null,
        countryCode: formData.countryCode,
        phone: formData.phone,
      });

      showToastMsg(
        "Registration successful! Redirecting to login...",
        "success",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      const msg = e.response?.data?.message || "Verification failed";
      setErrorMsg(msg);
      showToastMsg(msg, "error");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google register/login -> backend -> JWT -> AppContext.login()
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const idToken = await result.user.getIdToken();

      // ✅ backend gives our JWT
      const res = await axios.post(`${API}/google`, { idToken });

      const token = res?.data?.accessToken || res?.data?.token;
      if (!token) throw new Error("Backend token missing");

      await login(token);

      showToastMsg("Google registration successful!", "success");

      if (res?.data?.profileCompleted === false) {
        setTimeout(() => navigate("/profile"), 1200);
      } else {
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (e) {
      console.log("Google login error:", e.response?.data || e.message);
      const msg =
        e.response?.data?.message || e.message || "Google signup failed";
      setErrorMsg(msg);
      showToastMsg(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-[460px] border border-slate-700/50">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            {step === "register" ? (
              <User className="text-slate-900" size={28} />
            ) : (
              <Mail className="text-slate-900" size={28} />
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          {step === "register" ? "Create Account" : "Verify Email"}
        </h2>

        <p className="text-sm text-center text-slate-400 mb-6">
          {step === "register"
            ? "Join us and start your journey"
            : `Enter the 6-digit code sent to ${formData.userEmail}`}
        </p>

        {step === "register" ? (
          <div className="space-y-4">
            <InputField
              icon={<User size={18} />}
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
            />
            <InputField
              icon={<User size={18} />}
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
            />
            <InputField
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email address"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              error={errors.userEmail}
            />

            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-600 focus:border-amber-400"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 ml-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="w-28">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe size={18} />
                  </span>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-2 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <InputField
                  icon={<Phone size={18} />}
                  placeholder="Phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-4 text-slate-400">
                <MapPin size={18} />
              </span>
              <textarea
                name="address"
                placeholder="Address (optional)"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300 resize-none"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="text-red-400" size={16} />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Register with OTP
                </>
              )}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="px-4 text-slate-500 text-sm">or</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-slate-700/60 text-white border border-slate-600 hover:border-slate-500 hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <img
                src={google}
                alt="Google"
                className="w-6 h-6 bg-white rounded-full p-1"
              />
              Continue with Google
            </button>

            <p className="text-center text-slate-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-amber-400 font-semibold hover:text-amber-300 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Mail className="text-amber-400" size={18} />
              <span className="text-amber-300 text-sm">
                {formData.userEmail}
              </span>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-2xl font-bold bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-300 ${
                    digit ? "border-amber-500" : "border-slate-600"
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-slate-400 text-sm">
                  Resend OTP in{" "}
                  <span className="text-amber-400 font-semibold">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={loading}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} />
                  Resend OTP
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="text-red-400" size={16} />
                <p className="text-sm text-red-400">{errorMsg}</p>
              </div>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading || otp.join("").length !== 6}
              className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Verify & Create Account
                </>
              )}
            </button>

            <button
              onClick={() => {
                setStep("register");
                setOtp(["", "", "", "", "", ""]);
                setErrorMsg("");
              }}
              className="w-full text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          {...props}
          className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-600 focus:border-amber-400"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 ml-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
