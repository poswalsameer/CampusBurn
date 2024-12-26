'use client'

import Image from 'next/image'
import { UserCircle, LogOut, PenSquare, ThumbsUp, ThumbsDown, MessageCircle, HomeIcon, User } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface CurrentUser {
  email: string;
  username: string;
  profilePhoto: string;
  posts: any[]; //TODO: Need to create type for this
  comments: any[]; //TODO: Need to create type for this
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
  })
  const router = useRouter();
  const logoutUser = async () => {

    try {
      const logoutResponse = await axios.post("http://localhost:4200/auth/sign-out", {}, {withCredentials: true});
      console.log("This is the response after logout: ", logoutResponse);

      if(logoutResponse.status === 200){
        router.push("/");
      }
    } 
    catch (error) {
      console.log("Error while logging out the user: ", error);
    }

  }

  useEffect( () => {

    const fetchCurrentUserDetail = async () => {
      try {
        const currentUserDetailResponse = await axios.post("http://localhost:4200/getCurrentUser", {
          token: Cookies.get('token') || "",
        }, {withCredentials: true})

        //todo: Remove this log later
        console.log("Response: ", currentUserDetailResponse.data.CurrentUser);
        setCurrentUserDetails(currentUserDetailResponse.data.CurrentUser);
      } catch (error) {
        console.log("Error while fetching current user details: ", error);
      }
    }

    fetchCurrentUserDetail();


  }, [] )


  return (
    <div className="bg-black text-white flex min-h-screen overflow-hidden">
      {/* Left column - User Profile (20%) */}
      <div className="w-[20%] p-4 border-r border-gray-800 flex flex-col">
  <div className="flex items-center space-x-4 mb-6">
    <UserCircle className="w-12 h-12" />
    <div>
      {/* <h2 className="font-bold">John Doe</h2> */}
      <h2 className="text-base font-bold text-white">{currentUserDetails.username}</h2>
    </div>
  </div>
  <div className="space-y-2 mb-6">
    <button className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
      <HomeIcon className="w-5 h-5" />
      <span>Home</span>
    </button>
    <button className="w-full flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded">
      <User className="w-5 h-5" />
      <span>Profile</span>
    </button>
  </div>
  <div className="flex-grow"></div>
  <div className="space-y-4">
    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      <PenSquare className="inline-block mr-2" />
      Create Post
    </button>
    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    onClick={logoutUser}
    >
      <LogOut className="inline-block mr-2" />
      Logout
    </button>
  </div>
</div>

      {/* Middle column - Main Feed (55%) */}
      <div className="w-[55%] p-4 border-r border-gray-800 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-bold mb-4">Main Feed</h1>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <UserCircle className="w-8 h-8" />
                <span className="font-bold">User {i + 1}</span>
              </div>
              <p className="mb-4">This is a sample post content. It can be much longer in a real application.</p>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500">
                  <ThumbsDown className="w-5 h-5" />
                  <span>Dislike</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - Top Posts (25%) */}
      <div className="w-[25%] p-4 overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Top 10 Posts</h2>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-900 p-2 rounded">
              <p className="text-sm">Top post {i + 1} summary...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
