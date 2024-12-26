"use client";

import Image from "next/image";
import {
  UserCircle,
  LogOut,
  PenSquare,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  HomeIcon,
  User,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PostCard from "../appComponents/PostCard";
import TopPosts from "../appComponents/TopPosts";

interface CurrentUser {
  email: string;
  username: string;
  profilePhoto: string;
  posts: any[]; //TODO:Need to create type for this
  comments: any[]; //TODO:Need to create type for this
  createdAt: Date;
}

export default function Home() {
  const [currentUserDetails, setCurrentUserDetails] = useState<CurrentUser>({
    email: "",
    username: "",
    profilePhoto: "",
    posts: [],
    comments: [],
    createdAt: new Date(),
  });
  const router = useRouter();
  const logoutUser = async () => {
    try {
      const logoutResponse = await axios.post(
        "http://localhost:4200/auth/sign-out",
        {},
        { withCredentials: true }
      );
      console.log("This is the response after logout: ", logoutResponse);

      if (logoutResponse.status === 200) {
        setCurrentUserDetails({
          email: "",
          username: "",
          profilePhoto: "",
          posts: [],
          comments: [],
          createdAt: new Date(),
        });
        router.push("/");
      }
    } catch (error) {
      console.log("Error while logging out the user: ", error);
    }
  };

  useEffect(() => {
    const fetchCurrentUserDetail = async () => {
      try {
        const currentUserDetailResponse = await axios.post(
          "http://localhost:4200/getCurrentUser",
          {
            token: Cookies.get("token") || "",
          },
          { withCredentials: true }
        );

        //TODO:Remove this log later
        console.log("Response: ", currentUserDetailResponse.data.CurrentUser);
        setCurrentUserDetails(currentUserDetailResponse.data.CurrentUser);
      } catch (error) {
        console.log("Error while fetching current user details: ", error);
      }
    };

    fetchCurrentUserDetail();
  }, []);

  return (
    <div className="bg-black text-white flex min-h-screen overflow-hidden">

      {/* Left column - User Profile (20%) */}
      <div className="w-[20%] p-4 border-r border-gray-800 flex flex-col">
        <div className="flex justify-center items-center space-x-2 my-6">
          <UserCircle className="w-10 h-10" />
          <div>
            {/* <h2 className="font-bold">John Doe</h2> */}
            <h2 className="text-base font-bold text-white">
              {currentUserDetails.username}
            </h2>
          </div>
        </div>

        <div className="space-y-2 my-6">
          <button className="w-full flex items-center space-x-4 transition-all delay-75 ease-linear hover:bg-gray-700/30 text-white font-medium py-2 px-4 rounded">
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button className="w-full flex items-center space-x-4 transition-all delay-75 ease-linear hover:bg-gray-700/30 text-white font-medium py-2 px-4 rounded">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>

        <div className="flex-grow"></div>
        <div className="w-full flex flex-col justify-center items-center space-y-4 mb-3">
          <button className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white text-sm font-bold py-2 px-4 rounded-md">
            {/* <PenSquare className="inline-block mr-2" /> */}
            Post
          </button>
          <button
            className="w-[70%] bg-black hover:bg-red-500/70 transition-all delay-75 ease-linear border-2 border-red-600/40 text-red-500 hover:text-white text-sm font-bold py-2 px-4 rounded-md"
            onClick={logoutUser}
          >
            {/* <LogOut className="inline-block mr-2" /> */}
            Logout
          </button>
        </div>
      </div>

      {/* Middle column - Main Feed (55%) */}
      <div className="w-[55%] border-r border-gray-800 max-h-screen flex flex-col">
        <h1 className="text-2xl text-center p-6 font-bold mb-4 flex-shrink-0">Campusburn</h1>
        <div className="space-y-4 overflow-y-scroll flex-grow scrollBarDesign">
          {[...Array(10)].map((_, i) => (
            <PostCard i={i} />
          ))}
        </div>
      </div>

      {/* Right column - Top Posts (25%) */}
      <div className="w-[25%] max-h-screen flex flex-col">
        <h2 className="text-xl text-center p-6 font-bold mb-4 flex-shrink-0">Top 10 Posts</h2>
        <div className="space-y-2 overflow-y-scroll flex-grow scrollBarDesign">
          {[...Array(10)].map((_, i) => (
            <TopPosts i={i}/>
          ))}
        </div>
      </div>
    </div>
  );
}
