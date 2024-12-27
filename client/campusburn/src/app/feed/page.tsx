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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PostCard from "../appComponents/PostCard";
import TopPosts from "../appComponents/TopPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Post, UserPost } from '@/types/types';

interface CurrentUser {
  email: string;
  username: string;
  profilePhoto: string;
  posts: any[]; //TODO:Need to create type for this
  comments: any[]; //TODO:Need to create type for this
  createdAt: Date;
}

export default function Home() {
  const [currentPostData, setCurrentPostData] = useState<string>('');
  const [allPostsData, setAllPostsData] = useState<Post[]>([]);
  const [currentUserDetails, setCurrentUserDetails] = useState<CurrentUser>({
    email: "",
    username: "",
    profilePhoto: "",
    posts: [],
    comments: [],
    createdAt: new Date(),
  });
  const router = useRouter();
  const { toast } = useToast();

  //FUNCTION TO LOGOUT THE USER
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

  //FUNCTION TO CREATE A NEW POST
  const createPost = async () => {

    if( currentPostData === ''){
      //TODO:Add toast here
      alert("Post cannot be empty");
      return;
    }

    try {
      const createPostResponse = await axios.post(
        "http://localhost:4200/createPost",
        {"Content": currentPostData},
        { withCredentials: true }
      )
      setCurrentPostData('');
      //TODO:Need to remove this log later
      console.log("Post created: ", createPostResponse);

      if( createPostResponse.status === 200 ){
        toast({
          title: "Post created successfully",
        })
      }
      else{
        toast({
          title: "Cannot create your post at this moment",
        })
      }
    } 
    catch (error) {
      console.log("Error while creating a post: ", error);
    }

  }

  useEffect(() => {
    //FUNCTION TO FETCH THE CURRENT USER DETAILS
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

    //FUNCTION TO FETCH ALL POSTS IN THE DATABASE
    const fetchAllPostsInDatabase = async () => {

      try {
        const allPostsResponse = await axios.get(
          "http://localhost:4200/getAllPosts"
        );

        if (allPostsResponse.status !== 200) {
          throw new Error(`Error: Received status code ${allPostsResponse.status}`);
        }

        setAllPostsData(allPostsResponse.data.data);
        //TODO:We need to remove this log later
        console.log("All Posts response: ", allPostsResponse.data);
      } catch (error) {
        console.log("Error while fetching posts at this time: ", error);
      }

    }

    fetchCurrentUserDetail();
    fetchAllPostsInDatabase();

  }, []);

  // useEffect( () => {
  //   console.log("value in the state: ", allPostsData);
  // }, [allPostsData] )

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
          {/* <button className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white text-sm font-bold py-2 px-4 rounded-md">
            Post
          </button> */}
          <CreatePostButton 
            currentPostData={currentPostData}
            setCurrentPostData={setCurrentPostData}
            createPost={createPost}
          />
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
          {/* {[...Array(10)].map((_, i) => (
            <PostCard i={i} />
          ))} */}
          {allPostsData.map((post) => (
              <PostCard 
                key={post.Id} 
                index={post.Id}
                username={post.User.Username}
                content={post.Content}
                likeCount={post.LikeCount}
                dislikeCount={post.DislikeCount}
                comments={post.Comments}
              />
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


function CreatePostButton({ currentPostData, setCurrentPostData, createPost}: {currentPostData: string, setCurrentPostData: React.Dispatch<React.SetStateAction<string>>, createPost: () => Promise<void>}){
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white hover:text-white text-sm font-bold py-2 px-4 rounded-md"
          >Show Dialog</Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="h-96 flex flex-col justify-center items-center bg-black text-white rounded-xl border-2 border-gray-800">
        <AlertDialogHeader className="h-[80%] w-full flex flex-col justify-center items-center gap-y-4">
          <AlertDialogTitle className="h-[20%] font-normal w-full flex justify-center items-center ">
            Rant your heart out!
          </AlertDialogTitle>
          <AlertDialogDescription className="h-[60%] w-full">
            <Textarea 
              placeholder="....."
              value={currentPostData}
              onChange={(e) => setCurrentPostData(e.target.value)}
              className="h-full w-full border-none focus-within:outline-none bg-transparent text-gray-100">

            </Textarea>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="h-[20%] w-full flex justify-end items-center gap-x-2 ">
          <AlertDialogCancel
            className=" bg-black hover:bg-red-500/70 transition-all delay-75 ease-linear border-2 border-red-600/40 text-red-500 hover:text-white text-xs font-bold py-2 px-4 rounded-md"
            //Clearing the state when user clicks cancel
            onClick={() => setCurrentPostData('')}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className=" bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white hover:text-white text-xs font-semibold py-2 px-6 rounded-md"
            onClick={createPost}
          >
            Post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}