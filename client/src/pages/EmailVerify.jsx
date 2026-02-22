import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { setAccessToken } from "../../utils/tokenStorage";

const EmailVerify = () => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const email = localStorage.getItem("emailForVerification");
  const { getUserProfile, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text") || "";
    const digits = paste.replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    setOtp(digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    try {
      setIsSubmitting(true);
      if (!email) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      const { data } = await axiosInstance.post(
        `/api/auth/verify-email-with-otp`,
        { email, otp },
      );
      if (data.success) {
        setAccessToken(data.accessToken);
        localStorage.removeItem("emailForVerification");
        await getUserProfile?.();
        setIsLoggedIn(true);
        toast.success(data.message || "Email verified successfully");
        navigate("/", { replace: true });
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!email) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setIsResending(true);
      const { data } = await axiosInstance.post(`/api/auth/send-otp`, {
        email,
      });
      if (data.success) {
        toast.success(data.message || "OTP sent to your email");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 text-center">
          Verify your email
        </h1>
        <p className="text-sm text-slate-500 mb-6 text-center">
          We&apos;ve sent a 6-digit code to your <strong>{email}</strong>. Enter it below to verify
          your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            One-time password (OTP)
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onPaste={handlePaste}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 tracking-[0.5em] text-center text-lg"
            placeholder="••••••"
          />
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
