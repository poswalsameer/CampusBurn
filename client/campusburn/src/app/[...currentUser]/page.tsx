'use client'

import { HomeIcon, User, UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PostCard from '../appComponents/PostCard'
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import type { CurrentUser, Post } from '@/types/types'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import UpdateUserDialog from '@/components/update-user-dialog'

function CurrentUserProfilePage({params}: {params: any}) {

  const [currentPostData, setCurrentPostData] = useState<string>('');
  const [currentUserPosts, setCurrentUserPosts] = useState<Post[] | undefined>([]);
  const [updateUserDetails, setUpdateUserDetails] = useState<boolean>(false);
  const [currentUserDetails, setCurrentUserDetails] = useState<CurrentUser>({
    id: undefined,
    email: "",
    username: "",
    profilePhoto: "",
    posts: [],
    comments: [],
    createdAt: new Date(),
  })

  const router = useRouter();
  const pathname = usePathname();
  const userId = Cookies.get("currentUserId");
  
  // console.log("Pathname: ", pathname);

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
          id: undefined,
          email: "",
          username: "",
          profilePhoto: "",
          posts: [],
          comments: [],
          createdAt: new Date(),
        });
        Cookies.remove("currentUserId");
        router.push("/");
      }
    } catch (error) {
      console.log("Error while logging out the user: ", error);
    }
  };

  // FUNCTION TO CREATE A NEW POST
  const createPost = async () => {

    if( currentPostData === ''){
      //TODO:Add toast here
      alert("Post cannot be empty");
      return;
    }

    try {
      toast.loading("Creating your post...");
      const createPostResponse = await axios.post(
        "http://localhost:4200/createPost",
        {"Content": currentPostData},
        { withCredentials: true }
      )
      setCurrentPostData('');
      //TODO:Need to remove this log later
      console.log("Post created: ", createPostResponse);

      if( createPostResponse.status === 200 ){
        toast.success("Post created successfully");
      }
      else{
        toast.error("Error while creating the post");
      }
    } 
    catch (error) {
      console.log("Error while creating a post: ", error);
      toast.error("Error while creating the post");
    } finally {
      toast.dismiss();
    }

  }

  const deleteUser = async () => {
    const userId = Cookies.get("currentUserId");
    // TODO:Remove this later
    console.log("ID in the cookies: ", userId);

    try {

      const deleteUserResponse = await axios.delete(
        `http://localhost:4200/auth/deleteUser/${userId}`,
        { withCredentials: true },
      )

      if( deleteUserResponse.status === 200 ){
        Cookies.remove("token");
        Cookies.remove("currentUserId");
        router.push("/");
        console.log("User deleted successfully");
      }
      else{
        console.error("Error while deleting the user");
      }

    }
    catch (error) {
      console.error("Error while deleting the user: ", error);
    }

  }

  const routeToFeedPage = () => {
    router.push("/feed");
  }

  useEffect(() => {
    //FETCHING THE DETAILS OF THE CURRENT USER
    const userId = Cookies.get("currentUserId");
    if( userId === undefined ){
      return;
    }
    const currentUserId = parseInt(userId);

    console.log("Current user id: ", userId);

    const fetchCurrentUser = async () => {

      try {
        const currentUserDetailsResponse = await axios.post(
          "http://localhost:4200/getCurrentUserById",
          {
            "userId": currentUserId,
          },
          { withCredentials: true },
        )

        if( currentUserDetailsResponse.status === 200 ){
          console.log("Details of the current user: ", currentUserDetailsResponse.data.CurrentUser);
          setCurrentUserDetails({
            id: currentUserId,
            email: currentUserDetailsResponse.data.CurrentUser.Email,
            username: currentUserDetailsResponse.data.CurrentUser.Username,
            profilePhoto: currentUserDetailsResponse.data.CurrentUser.ProfilePhoto,
            posts: currentUserDetailsResponse.data.CurrentUser.Posts,
            comments: currentUserDetailsResponse.data.CurrentUser.Comments,
            createdAt: currentUserDetailsResponse.data.CurrentUser.CreatedAt,
          })
        }
        else{
          console.log("Error in the try part");
        }
      }
      catch (error) {
        console.error("Error while finding the current user");
      }

    }

    fetchCurrentUser();
  }, [updateUserDetails])

  useEffect( () => {

    const getCurrentUserPosts = async () => {

      if( currentUserDetails.id === undefined ){
        console.log("Id is undefined");
        return;
      }

      try {

        const currentUserPostsResponse = await axios.post(
          "http://localhost:4200/getCurrentUserPosts",
          {
            "userId": currentUserDetails.id
          },
          // { withCredentials: true }
        )

        if( currentUserPostsResponse.status === 200 ){
          console.log("Response after fetching the user posts: ", currentUserPostsResponse.data.currentUserPosts);
          setCurrentUserPosts(currentUserPostsResponse.data.currentUserPosts);
        }
        else{
          console.log("Error in the try part");
        }

      }
      catch (error) {
        console.error("Error while finding the posts of the current user");
      }

    }

    getCurrentUserPosts();

    console.log("Details inside current user: ", currentUserDetails);

  }, [currentUserDetails] )

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
          <button 
            className={`w-full flex items-center space-x-4 transition-all delay-75 ease-linear hover:bg-gray-700/30 ${ pathname === "/feed" ? "bg-gray-700/30" : "" } text-white font-medium py-2 px-4 rounded`}
            onClick={routeToFeedPage}  
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button 
            className={`w-full flex items-center space-x-4 transition-all delay-75 ease-linear hover:bg-gray-700/30 text-white ${ pathname !== "/feed" ? "bg-gray-700/30" : "" } font-medium py-2 px-4 rounded`}
            onClick={routeToFeedPage}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>

        <div className="flex-grow"></div>
        <div className="w-full flex flex-col justify-center items-center space-y-4 mb-3">
          {/* <button className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white text-sm font-bold py-2 px-4 rounded-md">
            Post
          </button> */}
          <UpdateUserDialog 
            userId={userId}
            updateUserDetails={updateUserDetails}
            setUpdateUserDetails={setUpdateUserDetails}
          />
          <CreatePostButton 
            currentPostData={currentPostData}
            setCurrentPostData={setCurrentPostData}
            createPost={createPost}
          />
          <button
            className="w-[70%] bg-black hover:bg-red-500/70 transition-all delay-75 ease-linear border-2 border-red-600/40 text-red-500 hover:text-white text-xs tracking-wide font-bold py-2 px-4 rounded-md"
            onClick={logoutUser}
          >
            {/* <LogOut className="inline-block mr-2" /> */}
            Logout
          </button>
          <button
            className="w-[70%] bg-black hover:bg-red-500/70 transition-all delay-75 ease-linear border-2 border-red-600/40 text-red-500 hover:text-white text-xs tracking-wide font-bold py-2 px-4 rounded-md"
            onClick={deleteUser}
          >
            {/* <LogOut className="inline-block mr-2" /> */}
            Delete Account
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
          {currentUserPosts?.map((post) => (
              <PostCard 
                key={post.Id} 
                id={post.Id}
                username={post.User.Username}
                content={post.Content}
                likeCount={post.LikeCount}
                dislikeCount={post.DislikeCount}
                comments={post.Comments}
                currentUserId={currentUserDetails.id}
                profilePage={true}
              />
          ))}
        </div>
      </div>

      {/* Right column - Top Posts (25%) */}
      <div className="w-[25%] max-h-screen flex flex-col">
        <h2 className="text-xl text-center p-6 font-bold mb-4 flex-shrink-0">Top 10 Posts</h2>
        {/* <div className="space-y-2 overflow-y-scroll flex-grow scrollBarDesign">
          {[...Array(10)].map((_, i) => (
            <TopPosts i={i}/>
          ))}
        </div> */}
      </div>
    </div>
  )
}

export default CurrentUserProfilePage

function CreatePostButton({ currentPostData, setCurrentPostData, createPost}: {currentPostData: string, setCurrentPostData: React.Dispatch<React.SetStateAction<string>>, createPost: () => Promise<void>}){
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white hover:text-white text-xs tracking-wide font-bold py-2 px-4 rounded-md"
        >
          Post
        </Button>
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
