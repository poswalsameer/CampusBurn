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
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../Loading";
import { Label } from "@/components/ui/label";

function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [otp, setOTP] = useState("");
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if( !otp ){
      toast({
        title: "OTP is required",
        variant: "destructive",
        className: "bg-red-600 text-white"
      })
      return;
    }

    console.log("Submitted OTP:", otp);

    setIsLoading(true); 
    try {
      //STEPS TO TAKE:
      // 1. Verify the OTP.
      // 2. If verification successful, then signup the user.
      // 3. If both verification and otp successful, then push the user to feed route

      const otpVerificationResponse = await axios.post("http://localhost:4200/verifyEmail", {
        Email: userDetails.email,
        OTP: otp,
      })

      if( otpVerificationResponse.status === 200 ){
        //SIGNUP THE USER AFTER EMAIL IS VERIFIED
        await registerUser(userDetails.email, userDetails.username, userDetails.password);
      }
      else{
        toast({
          title: "Error during email verification",
          variant: "destructive",
          className: "bg-red-600 text-white"
        })
        return;
      }

    } 
    catch (error) {
      console.log("INSIDE THE CATCH PART: Error while verifying the OTP.");
    }
    finally {
      setIsLoading(false); 
    }
  };

  const registerUser = async (email: string, username: string, password: string) => {

    const registerUserResponse = await axios.post("http://localhost:4200/auth/sign-up", {
      Username: username,
      Email: email,
      Password: password,
    })

    if( registerUserResponse.status === 201 ){
      router.push("/feed");
    }
    else{
      toast({
        title: "Error while registering the user",
        variant: "destructive",
        className: "bg-red-600 text-white"
      })
      return;
    }

  }

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
      {isLoading && <LoadingSpinner />} // Added loader component
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

      <div className="min-h-screen flex items-center justify-center">
        <Card className="z-10 w-[30rem] rounded-lg border-2 border-blue-400/20 bg-blue-950/30 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              Verify Email
            </CardTitle>
            <CardDescription className="text-md text-blue-200/70">
              Enter the OTP sent to your email
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-lg font-semibold text-blue-200">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="number"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOTP(e.target.value)}
                  className="bg-blue-950/30 rounded-lg border-2 border-blue-400/20 font-medium text-blue-200 placeholder-blue-400/50 focus:border-orange-400/50 focus:ring-orange-400/20"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-500 text-white font-semibold text-lg py-6 transition-all duration-300 shadow-lg hover:shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Page;
