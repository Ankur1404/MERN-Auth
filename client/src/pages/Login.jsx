import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
// import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";
import { setAccessToken } from "../../utils/tokenStorage";

const Login = () => {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { backendurl, setIsLoggedIn, getUserProfile } = useContext(AuthContext);

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        const { data } = await axiosInstance.post(`/api/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (data.success) {
          localStorage.setItem("emailForVerification", form.email);
          toast.success(
            data.message || "Signup successful. Please verify your email.",
          );
          navigate("/email-verify");
        } else {
          toast.error(data.message || "Signup failed");
        }
      } else {
        const { data } = await axiosInstance.post(`/api/auth/login`, {
          email: form.email,
          password: form.password,
        });

        if (data.success) {
          setAccessToken(data.accessToken);
          setIsLoggedIn(true);
          await getUserProfile();
          navigate("/");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      const errorData = error?.response?.data;
      if (errorData?.isVerified === false) {
        localStorage.setItem("emailForVerification", form.email);

        try {
          await axiosInstance.post("/api/auth/send-otp", {
            email: form.email,
          });

          toast.info("Email not verified. OTP sent again.");
        } catch (err) {
          toast.error("Failed to resend OTP");
        }

        navigate("/email-verify");
        return;
      }

      toast.error(errorData?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">
          {isSignup ? "Create Account" : "Login"}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            className="text-red-500 font-medium hover:underline cursor-pointer"
            onClick={() => setMode(isSignup ? "login" : "signup")}
          >
            {isSignup ? "Login" : "Create one"}
          </button>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {!isSignup && (
            <div className="text-right">
              <button
                onClick={() => navigate("/reset-password")}
                type="button"
                className="text-xs text-gray-500 hover:text-red-500 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-500 text-white font-medium py-2 rounded-lg hover:bg-red-600 transition-colors text-sm cursor-pointer"
          >
            {isSignup ? "Sign up" : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          <a
            href={`${backendurl}/api/auth/google`}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔵</span>
            <span>{isSignup ? "Sign up" : "Login"} with Google</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
