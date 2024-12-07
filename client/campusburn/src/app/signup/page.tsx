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

export default function Page() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const userDetails = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const {toast} = useToast();
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if( !userDetails.email || !userDetails.password || !userDetails.username ){
        toast({
            title: "Every field is required",
        })
        return;
    }

    console.log("Details entered by the user are: ", userDetails);

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

    // try {
    
    //     const signupResponse = await axios.post("http://localhost:4200/auth/sign-up", {
    //         Username: userDetails.username,
    //         Email: userDetails.email,
    //         Password: userDetails.password
    //     })

    //     console.log("Response coming after signup: ", signupResponse);

    // } 
    // catch (error) { 
    //     console.log("INSIDE THE CATCH PART: Error while signing up the user");
    // }

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
              Sign Up
            </CardTitle>
            <CardDescription className="text-sm font-bold text-blue-950 text-opacity-80 ">
              Sign up to join a community of awesome peeps
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateUserDetail({email: e.target.value}))
                  }
                  className="bg-blue-100 rounded-md border-2 border-blue-950 font-semibold text-black placeholder-blue-950 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-bold text-black">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={userDetails.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateUserDetail({username: e.target.value}))
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
                  placeholder="Create a password"
                  value={userDetails.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(updateUserDetail({password: e.target.value})) }
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
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
