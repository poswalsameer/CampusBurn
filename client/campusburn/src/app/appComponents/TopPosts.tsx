import { MessageCircle, ThumbsDown, ThumbsUp, UserCircle } from 'lucide-react'
import React from 'react'

function TopPosts({ i }: { i: number }) {
  return (
    <div>
    <div
      key={i}
      className="bg-black border space-y-5 border-l-0 border-r-0 border-gray-800 p-4 "
    >
      <div className="flex items-center space-x-2 mb-2">
        <UserCircle className="w-6 h-6 " />
        <span className="text-lg font-bold">User {i + 1}</span>
      </div>
      <p className="text-sm mb-4">
        This is a sample post content. It can be much longer in a real
        application.
      </p>
      <div className="flex ml-1 space-x-4">
        <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500">
          <ThumbsUp className="w-4 h-4" />
          {/* <span>Like</span> */}
        </button>
        <button className="mt-1 flex items-center space-x-1 text-gray-400 hover:text-red-500">
          <ThumbsDown className="w-4 h-4" />
          {/* <span>Dislike</span> */}
        </button>
        <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500">
          <MessageCircle className="w-4 h-4" />
          {/* <span>Comment</span> */}
        </button>
      </div>
    </div>
  </div>
  )
}

export default TopPosts
