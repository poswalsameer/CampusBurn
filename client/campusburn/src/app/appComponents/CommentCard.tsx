import { UserIcon } from "lucide-react";
import React from "react";

function CommentCard({
  id,
  content,
  username,
  createdAt,
}: {
  id: number;
  content: string;
  username: string;
  createdAt: Date;
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

  return (
    <div key={id} className=" border border-gray-800 p-3 flex items-start gap-2">
      <UserIcon className="h-4 w-4 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide text-sm">{username}</span>
          <span className="text-xs text-gray-500">{differenceInDays} { differenceInDays < 1 ? "hours ago" : differenceInDays < 2 ? "day ago" : "days ago" }</span>
        </div>
        <p className="text-sm text-blue-300">{content}</p>
      </div>
    </div>
  );
}

export default CommentCard;
