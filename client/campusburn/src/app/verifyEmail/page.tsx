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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [otp, setOTP] = useState("");

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the OTP to your server for verification
    console.log("Submitted OTP:", otp);
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
