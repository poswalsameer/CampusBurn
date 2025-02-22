"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Comments } from "@/types/types";
import axios from "axios";
import {
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import CommentCard from "./CommentCard";

function PostCard({
  id,
  username,
  content,
  likeCount: initialLikeCount,
  dislikeCount: initialDislikeCount,
  comments,
  currentUserId,
  profilePage,
}: {
  id: number;
  username: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  comments: any[];
  currentUserId: number | undefined;
  profilePage: boolean;
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [commentsForThisPost, setCommentForThisPost] = useState<
    Comments[] | undefined
  >([]);
  const [newCommentCreation, setNewCommentCreation] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState<number>(initialDislikeCount);
  const [newComment, setNewComment] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  // const { toast } = useToast();

  const closeCommentBox = () => {
    setIsCommentsOpen(false);
    setNewComment("");
  };

  // const handlePostLike = async () => {

  //   try {

  //     const likeResponse = await axios.post(
  //       "https://localhost:4200/likePost"
  //     )

  //   }
  //   catch (error) {
  //     console.error("Error while liking/unliking the post: ", error);
  //   }

  // }

  // FUNCTION TO ADD A COMMENT

  // FUNCTION TO ADD A COMMENT
  const addComment = async () => {
    if (newComment === "") {
      toast.warning("Comment cannot be left empty");
      return;
    }

    try {
      const addCommentResponse = await axios.post(
        "http://localhost:4200/addComment",
        {
          PostId: id,
          CommentContent: newComment,
          UserId: currentUserId,
        },
        { withCredentials: true }
      );

      if (addCommentResponse.status !== 200) {
        console.log("Comment not added");
        setIsCommentsOpen(false);
        setNewComment("");
        setNewCommentCreation(!newCommentCreation);
      } else {
        toast.success("Comment added successfully");
        setIsCommentsOpen(false);
        setNewComment("");
        //TODO:Remove this log later
        console.log("Response after adding comment: ", addCommentResponse.data);
        setNewCommentCreation(!newCommentCreation);
      }
    } catch (error) {
      console.log("Error while adding comment: ", error);
      setIsCommentsOpen(false);
      setNewComment("");
      setNewCommentCreation(!newCommentCreation);
    }
  };

  // FUNCTION TO LIKE A POST
  const likePost = async (postId: number) => {
    //Add the like as soon as the user clicks the like button
    setLikeCount(likeCount + 1);

    try {
      const likePostResponse = await axios.post("http://localhost:4200/likePost", {
        PostId: postId,
        UserId: currentUserId,
      }, { withCredentials: true })

      if (likePostResponse.status === 200) {
        console.log("Post liked successfully: ", likePostResponse.data);
        setLikeCount(likePostResponse.data.LikeCount);
      } else {
        console.log("Error while liking/unliking the post");
      }
    } catch (error) {
      setLikeCount(likeCount - 1);
      console.log("Error while liking/unliking the post: ", error);
    }
  }

  // FUNCTION TO DISLIKE A POST
  const dislikePost = async (postId: number) => {
    setDislikeCount(dislikeCount + 1);

    try {
      const dislikePostResponse = await axios.post("http://localhost:4200/dislikePost", {
        PostId: postId,
        UserId: currentUserId,
      }, { withCredentials: true })

      if (dislikePostResponse.status === 200) {
        console.log("Post disliked successfully: ", dislikePostResponse.data);
        setDislikeCount(dislikePostResponse.data.DislikeCount);
      } else {
        console.log("Error while disliking/undisliking the post");
      }

    } catch (error) {
      setDislikeCount(dislikeCount - 1);
      console.log("Error while disliking/undisliking the post: ", error);
    }
  }

  // FUNCTION TO GET ALL COMMENTS FOR A POST
  const getAllCommentsForThisPost = async () => {

    console.log("Current user id: ", currentUserId);
    setLoadingComments(true);
    setIsCommentsOpen(true);

    try {
      const getAllCommentsResponse = await axios.post(
        "http://localhost:4200/allComments",
        { postId: id },
        { withCredentials: true }
      );

      if (getAllCommentsResponse.status === 200) {
        //TODO:Remove this later
        console.log("Comments fetched: ", getAllCommentsResponse.data.Comments);
        setCommentForThisPost(getAllCommentsResponse.data.Comments);

        setLoadingComments(false);
      } else {
        console.log("error in the try part while fetching comments");
        setLoadingComments(false);
      }
    } catch (error) {
      console.error("Error while getting the comments for this post: ", error);
      setLoadingComments(false);
    }
  };

  //FUNCTION TO DELETE A POST
  const deletePost = async (postId: number) => {
    try {
      console.log("post clicked: ", postId);
      toast.loading("Deleting the post...");
      const deletePostResponse = await axios.post("http://localhost:4200/deletePost", {
        PostId: postId,
        UserId: currentUserId,
      }, { withCredentials: true })
      
      if(deletePostResponse.status === 200){
        console.log("post deleted: ", deletePostResponse);
        toast.success("Post deleted successfully");
      } else {
        console.log("error in try part");
        toast.error("Error while deleting the post");
      }


    } catch (error) {
      console.error("Error while deleting your comment: ", error);
    } finally {
      toast.dismiss();
    }
  }

  useEffect(() => {
    getAllCommentsForThisPost();
    setIsCommentsOpen(false);
    // console.log("comments for this post in the second effect: ", commentsForThisPost)
    // commentsForThisPost
  }, [newCommentCreation]);

  return (
    // <div>
    <div
      key={id}
      className="relative bg-black border space-y-5 border-l-0 border-r-0 border-gray-800 p-4 "
    >
      <div className="flex items-center space-x-2 mb-2">
        <UserCircle className="w-8 h-8" />
        <span className="text-lg font-bold">{username}</span>
      </div>
      <p className="text-sm mb-4">{content}</p>
      <div className="flex ml-1 space-x-4">
        <button
          className="flex items-center space-x-1 text-gray-400 hover:text-blue-500"
          onClick={() => likePost(id)}
        >
          <ThumbsUp className="w-4 h-4 text-blue-500" />
          <span>{likeCount < 0 ? 0 : likeCount}</span>
        </button>
        <button
          className="mt-1 flex items-center space-x-1 text-gray-400 hover:text-red-500"
          onClick={() => dislikePost(id)}
        >
          <ThumbsDown className="w-4 h-4 text-red-500" />
          <span>{dislikeCount < 0 ? 0 : dislikeCount}</span>
        </button>
        <button
          className="flex items-center space-x-1 text-gray-400 hover:text-green-500"
          onClick={getAllCommentsForThisPost}
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span>{commentsForThisPost ? commentsForThisPost.length : "0"}</span>
        </button>
      </div>
      {isCommentsOpen &&
        (loadingComments ? (
          <div>Loading comments...</div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border-gray-800 focus-within:outline-none bg-transparent text-gray-100 flex-grow"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="p-2 bg-black hover:bg-red-500/70 transition-all delay-75 ease-linear border-2 border-red-600/40 text-red-500 hover:text-white"
                onClick={closeCommentBox}
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white hover:text-white p-2"
                onClick={addComment}
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-4">
              {commentsForThisPost!.map((currentComment) => (
                <CommentCard
                  id={currentComment.CommentId}
                  userId={currentComment.User.UserId}
                  currentUserId={currentUserId}
                  content={currentComment.CommentContent}
                  username={currentComment.User.Username}
                  createdAt={currentComment.CreatedAt}
                  commentsForThisPost={commentsForThisPost}
                  setCommentsForThisPost={setCommentForThisPost}
                />
              ))}
            </div>
          </div>
        ))}
      {profilePage ? (
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          aria-label="delete-comment"
          onClick={() => deletePost(id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <></>
      )}
    </div>

    // {/* </div> */}
  );
}

export default PostCard;
