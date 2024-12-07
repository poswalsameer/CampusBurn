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
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUserDetail } from "@/reducers/userSlice";
import LoadingSpinner from "../Loading";

export default function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const {toast} = useToast();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if( !userDetails.email || !userDetails.password || !userDetails.username ){
        toast({
            title: "Every field is required",
        })
        return;
    }

    console.log("Details entered by the user are: ", userDetails);

    setIsLoading(true); 
    try {
      const emailVerificationResponse = await axios.post("http://localhost:4200/sendEmail", {
        Email: userDetails.email
      })

      if(emailVerificationResponse.status === 202 ){
        router.push("/verifyEmail");
      }
      else{
        toast({
          title: "Error while sending the email",
        })
        return;
      }
    } 
    catch (error) {
      console.log("INSIDE THE CATCH: Error while sending the OTP to user");
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
              Create Account
            </CardTitle>
            <CardDescription className="text-md text-blue-200/70">
              Join our community of innovators and creators
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateUserDetail({email: e.target.value}))
                  }
                  className="bg-blue-950/30 rounded-lg border-2 border-blue-400/20 font-medium text-blue-200 placeholder-blue-400/50 focus:border-orange-400/50 focus:ring-orange-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-lg font-semibold text-blue-200">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={userDetails.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateUserDetail({username: e.target.value}))
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
                    placeholder="Create a strong password"
                    value={userDetails.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(updateUserDetail({password: e.target.value}))}
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
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
