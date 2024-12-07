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
import LoadingSpinner from "../Loading";

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if( !userDetails.email || !userDetails.password ){
        toast({
            title: "Every field is required",
        })
        return;
    }

    setIsLoading(true);
    try {
        const loginResponse = await axios.post("http://localhost:4200/auth/sign-in", {
            Email: userDetails.email,
            Password: userDetails.password
        })

        if( loginResponse.status === 404 ){
            console.log("User not found in the database");
            toast({
                title: "User not found",
                variant: "destructive"
            });
        }
        else if( loginResponse.status === 200 ){
            console.log("Response after login: ", loginResponse);
            toast({
                title: "Login successful",
                variant: "default"
            });
        }
    } 
    catch (error) {
        console.log("INSIDE THE CATCH PART: Error while logging the user");
        toast({
            title: "Login failed",
            description: "Please check your credentials and try again",
            variant: "destructive"
        });
    }
    finally {
        setIsLoading(false);
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
      {isLoading && <LoadingSpinner />}
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-md text-blue-200/70">
              Login to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold text-blue-200">
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
                  className="bg-blue-950/30 rounded-lg border-2 border-blue-400/20 font-medium text-blue-200 placeholder-blue-400/50 focus:border-orange-400/50 focus:ring-orange-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg font-semibold text-blue-200">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={userDetails.password}
                    onChange={(e: any) => setUserDetails({...userDetails, password: e.target.value})}
                    className="bg-blue-950/30 rounded-lg border-2 border-blue-400/20 font-medium text-blue-200 placeholder-blue-400/50 focus:border-orange-400/50 focus:ring-orange-400/20"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400/70 hover:text-orange-400 transition-colors focus:outline-none"
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
            <CardFooter className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6 transition-all duration-300 shadow-lg"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
