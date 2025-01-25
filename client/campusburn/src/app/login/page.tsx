"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface UserLoginDetails {
  email: string;
  password: string;
}

interface ToastMessage {
  message: string;
  type: "success" | "error";
}

export default function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [userDetails, setUserDetails] = useState<UserLoginDetails>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetails.email || !userDetails.password) {
      setToastMessage({
        message: "Every field is required",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await axios.post(
        "http://localhost:4200/auth/sign-in",
        {
          Email: userDetails.email,
          Password: userDetails.password,
        },
        { withCredentials: true }
      );

      if (loginResponse.status === 200) {
        setToastMessage({ message: "Login successful", type: "success" });
        router.push("/feed");
      }
    } catch (error) {
      setToastMessage({
        message: "Login failed. Please check your credentials.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-900 to-black text-white overflow-hidden font-sans"
      ref={parentRef}
    >
      {/* left section */}
      <div className="hidden md:block md:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-orange-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234a90e2' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          opacity: 0.1
        }} />
      </div>

      {/* right section - improved layout */}
      <div className="w-full md:w-2/4 lg:w-[600px] min-h-screen md:min-h-0 bg-gray-800/80 backdrop-blur-sm px-6 md:px-12 py-8 md:py-16 rounded-none md:rounded-lg shadow-xl flex flex-col justify-center">
        <div className="w-full max-w-[400px] mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-400">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm tracking-wide">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-blue-400/20 focus:outline-none focus:border-orange-400/50 transition-colors text-blue-200 placeholder:text-gray-500"
                placeholder="Enter your email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm tracking-wide">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-blue-400/20 focus:outline-none focus:border-orange-400/50 transition-colors text-blue-200 placeholder:text-gray-500"
                  placeholder="Enter your password"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? "👁" : "👁"}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] text-lg shadow-lg shadow-blue-900/20"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            New to CampusBurn?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-orange-400 transition-colors font-medium"
            >
              Sign up for an account
            </a>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            toastMessage.type === "success" ? "bg-blue-500" : "bg-orange-500"
          }`}
        >
          <p className="text-white text-sm md:text-base">
            {toastMessage.message}
          </p>
          <Button
            onClick={() => setToastMessage(null)}
            className="absolute top-1 right-1 text-white hover:text-blue-100"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
}
