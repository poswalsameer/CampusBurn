"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
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
  likeCount,
  dislikeCount,
  comments,
  userId,
  profilePage,
}: {
  id: number;
  username: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  comments: any[];
  userId: number | undefined;
  profilePage: boolean;
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [commentsForThisPost, setCommentForThisPost] = useState<
    Comments[] | undefined
  >([]);
  const [newCommentCreation, setNewCommentCreation] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the new comment to your backend
    console.log("New comment:", newComment);
    setNewComment("");
  };

  const { toast } = useToast();

  const closeCommentBox = () => {
    setIsCommentsOpen(false);
    setNewComment("");
  };

  //TODO:Complete this like function after writing down the controllers
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

  const addComment = async () => {
    if (newComment === "") {
      toast({
        title: "Comment cannot be empty",
      });
      return;
    }

    try {
      const addCommentResponse = await axios.post(
        "http://localhost:4200/addComment",
        {
          PostId: id,
          CommentContent: newComment,
          UserId: userId,
        },
        { withCredentials: true }
      );

      if (addCommentResponse.status !== 200) {
        console.log("Comment not added");
        setIsCommentsOpen(false);
        setNewComment("");
        setNewCommentCreation(!newCommentCreation);
      } else {
        toast({
          title: "Comment added successfully",
        });
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

  // FUNCTION TO GET ALL COMMENTS FOR A POST
  const getAllCommentsForThisPost = async () => {
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
      } else {
        console.log("error in the try part while fetching comments");
      }
    } catch (error) {
      console.error("Error while getting the comments for this post: ", error);
    }
  };

  useEffect(() => {
    getAllCommentsForThisPost();
    setIsCommentsOpen(false);
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
        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500">
          <ThumbsUp className="w-4 h-4" />
          <span>{likeCount}</span>
        </button>
        <button className="mt-1 flex items-center space-x-1 text-gray-400 hover:text-red-500">
          <ThumbsDown className="w-4 h-4" />
          <span>{dislikeCount}</span>
        </button>
        <button
          className="flex items-center space-x-1 text-gray-400 hover:text-green-500"
          onClick={getAllCommentsForThisPost}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{commentsForThisPost?.length}</span>
        </button>
      </div>
      {isCommentsOpen && (
        <div className="mt-4 space-y-4">
          <form onSubmit={handleCommentSubmit} className="flex space-x-2">
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
          </form>
          <div className="space-y-4">
            {commentsForThisPost?.map((comment) => (
              <CommentCard
                id={comment.Id}
                userId={comment.User.Id}
                content={comment.CommentContent}
                username={comment.User.Username}
                createdAt={comment.CreatedAt}
              />
            ))}
          </div>
        </div>
      )}
      {profilePage ? (
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          aria-label="delete-comment"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : ( <></> ) }
    </div>

    // {/* </div> */}
  );
}

export default PostCard;
