import { MessageCircle, ThumbsDown, ThumbsUp, UserCircle } from "lucide-react";
import React from "react";

function PostCard(
  { index, username, content, likeCount, dislikeCount, comments }: { index: number, username: string, content: string, likeCount: number, dislikeCount: number, comments: any[] }) {
  return (
    <div>
      <div
        key={index}
        className="bg-black border space-y-5 border-l-0 border-r-0 border-gray-800 p-4 "
      >
        <div className="flex items-center space-x-2 mb-2">
          <UserCircle className="w-8 h-8" />
          <span className="text-xl font-bold">{username}</span>
        </div>
        <p className="text-base mb-4">
          {content}
        </p>
        <div className="flex ml-1 space-x-4">
          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500">
            <ThumbsUp className="w-4 h-4" />
            <span>{likeCount}</span>
          </button>
          <button className="mt-1 flex items-center space-x-1 text-gray-400 hover:text-red-500">
            <ThumbsDown className="w-4 h-4" />
            <span>{dislikeCount}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
