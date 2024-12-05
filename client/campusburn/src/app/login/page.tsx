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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUp } from "@clerk/nextjs";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface UserLoginDetails {
  email: string;
  password: string;
}

export default function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [userDetails, setUserDetails] = useState<UserLoginDetails>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const {toast} = useToast();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if( !userDetails.email || !userDetails.password ){
        toast({
            title: "Every field is required",
        })
    }

    try {
        
        const loginResponse = await axios.post("http://localhost:4200/auth/sign-in", {
            Email: userDetails.email,
            Password: userDetails.password
        })

        if( loginResponse.status === 404 ){
            console.log("User not found in the database");
        }
        else if( loginResponse.status === 202 ){
            console.log("Response after login: ", loginResponse);
        }

    } 
    catch (error) {
        console.log("INSIDE THE CATCH PART: Error while logging the user");
    }


  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              Login
            </CardTitle>
            <CardDescription className="text-sm font-bold text-blue-950 text-opacity-80 ">
              Welcome back!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-bold text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={userDetails.email}
                  onChange={(e: any) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  className="bg-blue-100 rounded-md border-2 border-blue-950 font-semibold text-black placeholder-blue-950 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-bold text-black">
                  Password
                </Label>
                <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={userDetails.password}
                  onChange={(e: any) => setUserDetails({...userDetails, password: e.target.value})}
                  className="bg-blue-100 rounded-md border-2 border-blue-950 font-semibold text-black placeholder-blue-950 focus:ring-0 focus:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-gray-900 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full rounded-md bg-gray-950 hover:bg-gray-800 text-gray-100"
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}