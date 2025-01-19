import { Button } from "@/components/ui/button";
import { Comments } from "@/types/types";
import axios from "axios";
import { Trash2, UserIcon, XCircleIcon } from "lucide-react";
import { comment } from "postcss";
import React from "react";

//TODO: Types should be same as used in the backend

function CommentCard({
  id,
  userId,
  currentUserId,
  content,
  username,
  createdAt,
  commentsForThisPost,
  setCommentsForThisPost
}: {
  id: number;
  userId: number;
  currentUserId: number | undefined;
  content: string;
  username: string;
  createdAt: Date;
  commentsForThisPost: Comments[] | undefined;
  setCommentsForThisPost: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
}) {

  const today = new Date();
  const differenceInTime = today.getTime() - new Date(createdAt).getTime();
  let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  if( differenceInDays < 1 ){
    const differenceInSeconds = Math.ceil(differenceInTime / 1000);
    const differenceInMinutes = Math.ceil(differenceInSeconds / 60);
    const differenceInHours = Math.ceil(differenceInMinutes / 60);
    differenceInDays = differenceInHours; 
  }

  // FUNCTION TO DELETE A COMMENT
  const deleteComment = async (commentId: number, currentUserId: number) => {
    console.log("Sending request with:", { commentId: commentId, userId: currentUserId });

    const deleteCommentResponse = await axios.post( 
      "http://localhost:4200/deleteComment",
      { 
        "CommentId": commentId,
        "UserId": currentUserId, 
      },
      { withCredentials: true }
    )

    if( deleteCommentResponse.status === 200 ){
      setCommentsForThisPost( commentsForThisPost?.filter( comment => comment.CommentId !== commentId ) );
    }

     console.log("Delete response: ", deleteCommentResponse.data);
  }

  return (
    <div key={id} className="relative border border-gray-800 p-3 flex items-start gap-2" >
      <UserIcon className="h-4 w-4 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide text-sm">{username}</span>
          <span className="text-xs text-gray-500">{differenceInDays} { differenceInDays < 1 ? "hours ago" : differenceInDays < 2 ? "day ago" : "days ago" }</span>
        </div>
        <p className="text-sm text-blue-300">{content}</p>
      </div>
      { userId === currentUserId ? (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            aria-label="delete-comment"
            onClick={ () => deleteComment(id, userId) }
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : ( <></> ) }
    </div>
  );
}

export default CommentCard;
