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
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:8086/api/auth";

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState("register"); // register | otp
  const [loading, setLoading] = useState(false);

  /* ---------------- FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    userName: "",
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

  /* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  /* ---------------- INPUT HANDLER ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setErrorMsg("");
  };

  /* ---------------- FORM VALIDATION ---------------- */
  const validateForm = () => {
    const e = {};

    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    if (!formData.userName.trim()) e.userName = "Username is required";

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

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.post(`${API}/send-otp`, {
        email: formData.userEmail, // OTP API expects email
      });

      setStep("otp");
      setTimer(60);
      alert("OTP sent to your email");
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const resendOtp = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/send-otp`, {
        email: formData.userEmail,
      });

      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      alert("OTP resent");
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP INPUT ---------------- */
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value.slice(-1);
    setOtp(copy);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  /* ---------------- VERIFY OTP + REGISTER ---------------- */
  const verifyOtp = async () => {
    if (otp.join("").length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Verify OTP
      await axios.post(`${API}/verify-otp`, {
        email: formData.userEmail,
        otp: otp.join(""),
      });

      // 2️⃣ Register User (MATCH UserRequest DTO EXACTLY)
      await axios.post(`${API}/register`, {
        userName: formData.userName,
        userEmail: formData.userEmail,
        password: formData.password,
        fullName: formData.fullName,
        address: formData.address || null,
        countryCode: formData.countryCode,
        phone: formData.phone,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "OTP verification failed");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[420px]">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {step === "register" ? "Create Account" : "Verify OTP"}
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          {step === "register"
            ? "Create your account to continue"
            : "Enter the 6-digit OTP sent to your email"}
        </p>

        {step === "register" ? (
          <div className="space-y-4">
            <Input
              icon={<User />}
              placeholder="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
            />

            <Input
              icon={<User />}
              placeholder="Username"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              error={errors.userName}
            />

            <Input
              icon={<Mail />}
              placeholder="Email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              error={errors.userEmail}
            />

            <Input
              icon={<Lock />}
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
            />

            {/* Country Code + Phone */}
            <div className="flex gap-2">
              <div className="w-1/3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Globe size={18} />
                  </span>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                               focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <Input
                  icon={<Phone />}
                  placeholder="Phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />
              </div>
            </div>

            <textarea
              name="address"
              placeholder="Address (optional)"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500
                         text-white font-semibold py-2 rounded-lg
                         hover:scale-105 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already registered?{" "}
              <Link to="/login" className="text-blue-600 font-semibold">
                Login
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  maxLength="1"
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold border
                             border-gray-300 rounded-lg focus:ring-2
                             focus:ring-blue-400"
                />
              ))}
            </div>

            <div className="text-center text-sm">
              {timer > 0 ? (
                <span className="text-gray-500">Resend in {timer}s</span>
              ) : (
                <button
                  onClick={resendOtp}
                  className="text-blue-600 font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-white font-semibold
                         py-2 rounded-lg hover:scale-105 transition
                         flex items-center justify-center gap-2"
            >
              <Check size={18} /> Verify OTP
            </button>

            <button
              onClick={() => setStep("register")}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              Back to Registration
            </button>
          </div>
        )}

        {errorMsg && (
          <p className="text-sm text-red-600 mt-4 flex items-center gap-1">
            <AlertCircle size={14} /> {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- REUSABLE INPUT ---------------- */
function Input({ icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-3 top-2.5 text-gray-400">{icon}</span>
        <input
          {...props}
          className={`w-full pl-10 pr-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-400`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
