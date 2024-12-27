"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import { log } from "console";
import {
  MessageCircle,
  Send,
  ThumbsDown,
  ThumbsUp,
  UserCircle,
  X,
} from "lucide-react";
import React, { useState } from "react";

function PostCard({
  id,
  username,
  content,
  likeCount,
  dislikeCount,
  comments,
  userId
}: {
  id: number;
  username: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  comments: any[];
  userId: number | undefined;
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

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
  }

  const addComment = async () => {

    if( newComment === "" ){
      toast({
        title: "Comment cannot be empty",
      })
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
      )

      if( addCommentResponse.status !== 200 ){
        console.log("Comment not added");
        setIsCommentsOpen(false);
        setNewComment("");
      }
      else{
        toast({
          title: "Comment added successfully",
        })
        setIsCommentsOpen(false);
        setNewComment("");
        //TODO:Remove this log later
        console.log("Response after adding comment: ", addCommentResponse.data);
      }

    } 
    catch (error) {
      console.log("Error while adding comment: ", error);
      setIsCommentsOpen(false);
      setNewComment("");
    }

  }

  return (
    <div>
      <div
        key={id}
        className="bg-black border space-y-5 border-l-0 border-r-0 border-gray-800 p-4 "
      >
        <div className="flex items-center space-x-2 mb-2">
          <UserCircle className="w-8 h-8" />
          <span className="text-xl font-bold">{username}</span>
        </div>
        <p className="text-base mb-4">{content}</p>
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
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
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
            <div className="space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900 p-2 rounded">
                  <div className="font-bold">{comment.username}</div>
                  <div>{comment.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
