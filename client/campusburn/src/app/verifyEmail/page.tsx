"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FlickeringGrid from "@/components/ui/flickering-grid";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../appComponents/Loading";
import { Label } from "@/components/ui/label";
import Cookie from "js-cookie";
import ToastNew from "@/components/newToast";

function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [otp, setOTP] = useState("");
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setToastMessage({
        message: "OTP is required",
        type: "error",
      });
      return;
    }

    console.log("Submitted OTP:", otp);

    setIsLoading(true);
    try {
      //STEPS TO TAKE:
      // 1. Verify the OTP.
      // 2. If verification successful, then signup the user.
      // 3. If both verification and otp successful, then push the user to feed route

      const otpVerificationResponse = await axios.post(
        "http://localhost:4200/verifyEmail",
        {
          Email: userDetails.email,
          OTP: otp,
        }
      );

      if (otpVerificationResponse.status === 200) {
        // SIGNUP THE USER AFTER EMAIL IS VERIFIED
        await registerUser(
          userDetails.email,
          userDetails.username,
          userDetails.password
        );
      } else {
        setToastMessage({
          message: "Error during email verification",
          type: "error",
        });
        return;
      }
    } catch (error) {
      console.log("INSIDE THE CATCH PART: Error while verifying the OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    const registerUserResponse = await axios.post(
      "http://localhost:4200/auth/sign-up",
      {
        Username: username,
        Email: email,
        Password: password,
      }
    );

    if (registerUserResponse.status === 200) {
      console.log("response after register user: ", registerUserResponse);

      router.push("/feed");
    } else {
      setToastMessage({
        message: "Error while registering the use",
        type: "error",
      });
      return;
    }
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

  return (
    <div
      className="min-h-screen w-full bg-black flex justify-center items-center overflow-x-hidden"
      ref={parentRef}
    >
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full overflow-x-hidden"
        squareSize={4}
        gridGap={6}
        color="#254062"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={dimensions.height}
        width={dimensions.width}
      />
      <div className=" min-h-screen flex items-center justify-center ">
        {/* z-10 w-[30rem] rounded-lg border-2 border-blue-400/20 bg-blue-950/30 backdrop-blur-sm */}
        <Card className="z-10 w-[30rem] rounded-lg border-2 border-blue-400/20 bg-blue-950/30 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              Verify Email
            </CardTitle>
            <CardDescription className="text-md text-blue-200/70 ">
              Enter the OTP sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-lg font-semibold text-blue-200"
              >
                OTP
              </Label>
              <Input
                type="number"
                value={otp}
                onChange={(e: any) => setOTP(e.target.value)}
                className="bg-blue-950/30 rounded-lg border-2 border-blue-400/20 font-medium text-blue-200 placeholder-blue-400/50 focus:border-orange-400/50 focus:ring-orange-400/20"
              ></Input>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              onClick={handleVerifyOTP}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6 transition-all duration-300 shadow-lg"
            >
              Verify
            </Button>
          </CardFooter>
        </Card>
      </div>
      {toastMessage && (
        <ToastNew
          title={toastMessage.type === "success" ? "Success" : "Error"}
          message={toastMessage.message}
          type={toastMessage.type}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
}

export default Page;
