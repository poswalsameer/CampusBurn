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

function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [otp, setOTP] = useState("");
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if( !otp ){
      toast({
        title: "OTP is required",
      })
      return;
    }

    console.log("Submitted OTP:", otp);

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
        })
        return;
      }

    } 
    catch (error) {
      console.log("INSIDE THE CATCH PART: Error while verifying the OTP.");
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

      <div className=" min-h-screen flex items-center justify-center bg-black">
        <Card className="z-10 w-[30rem] rounded-md border-none bg-blue-600 text-black">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-black">
              Verify Email
            </CardTitle>
            <CardDescription className="text-sm font-bold text-blue-950 text-opacity-80 ">
              Enter the OTP sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className=" space-y-4">
              <div className=" w-full flex justify-center">
                <Input 
                type="number"
                value={otp}
                onChange={(e: any) => setOTP(e.target.value)}
                className="w-full border border-blue-950 bg-black text-white focus:border focus:border-blue-950 font-[500] bg-opacity-35 " >

                </Input>
              </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              onClick={handleVerifyOTP}
              className="w-full rounded-md bg-gray-950 hover:bg-gray-800 text-gray-100"
            >
              Verify
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Page;
