"use client";
import React, { useState, useRef, useEffect } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUserDetail } from "@/reducers/userSlice";
import LoadingSpinner from "../appComponents/Loading";
import ToastNew from "@/components/newToast";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("Select a profile photo");
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!userDetails.email || !userDetails.password || !userDetails.username) {
      setToastMessage({ message: "Every field is required", type: "error" });
      setTimeout(() => setToastMessage(null), 3000); // Reset toast after 3 seconds
      return;
    }

    console.log("Details entered by the user are: ", userDetails);

    setIsLoading(true);
    try {
      const emailVerificationResponse = await axios.post(
        "http://localhost:4200/sendEmail",
        {
          Email: userDetails.email,
        }
      );

      if (emailVerificationResponse.status === 200) {
        setToastMessage({
          message: "Email sent successfully!",
          type: "success",
        });
        setTimeout(() => setToastMessage(null), 3000); // Reset toast after 3 seconds
        router.push("/verifyEmail");
      } else {
        setToastMessage({
          message: "Error while sending the email",
          type: "error",
        });
        setTimeout(() => setToastMessage(null), 3000); // Reset toast after 3 seconds
        return;
      }
    } catch (error) {
      setToastMessage({
        message: "Error while sending the OTP to user",
        type: "error",
      });
      setTimeout(() => setToastMessage(null), 3000); // Reset toast after 3 seconds
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        setDimensions({
          width: parentRef.current.offsetWidth,
          height: parentRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleCloseToast = () => {
    setToastMessage(null); //
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-900 to-black text-white overflow-hidden font-sans">
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

      {/* right section - layout */}
      <div className="w-full md:w-2/4 lg:w-[600px] min-h-screen md:min-h-0 bg-gray-800/80 backdrop-blur-sm px-6 md:px-12 py-8 md:py-16 rounded-none md:rounded-lg shadow-xl flex flex-col justify-center">
        <div className="w-full max-w-[400px] mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-400">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Join our community and start your journey
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-blue-400/20 focus:outline-none focus:border-orange-400/50 transition-colors text-blue-200 placeholder:text-gray-500"
                placeholder="Enter your full name"
                value={userDetails.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(updateUserDetail({ username: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 font-medium text-sm tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-blue-400/20 focus:outline-none focus:border-orange-400/50 transition-colors text-blue-200 placeholder:text-gray-500"
                placeholder="Enter your email"
                value={userDetails.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(updateUserDetail({ email: e.target.value }))
                }
              />
            </div>

            <div className="relative space-y-2">
              <label className="block text-gray-300 font-medium text-sm tracking-wide">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-blue-400/20 focus:outline-none focus:border-orange-400/50 transition-colors text-blue-200 placeholder:text-gray-500"
                placeholder="Create a password"
                value={userDetails.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(updateUserDetail({ password: e.target.value }))
                }
              />
              <Button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-7 text-blue-400/70 hover:text-orange-400"
              >
                👁
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] text-lg shadow-lg shadow-blue-900/20"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-orange-400 transition-colors font-medium"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            toastMessage.type === "success" ? "bg-blue-500" : "bg-orange-500"
          }`}
        >
          <p className="text-white">{toastMessage.message}</p>
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