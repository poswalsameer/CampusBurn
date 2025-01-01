'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

function UpdateUserDialog({
    userId,
    updateUserDetails,
    setUpdateUserDetails
}: {
    userId: string | undefined;
    updateUserDetails: boolean;
    setUpdateUserDetails: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [username, setUsername] = useState('')
    const [isOpen, setIsOpen] = useState(false)
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if( username === "" ){
        toast({
            title: "Username cannot be left empty",
        })
        setIsOpen(false);
        return;
      }

      if( userId === undefined ){
        toast({
            title: "User ID not found",
        })
        setIsOpen(false);
        return;
      }
      
      try {

        const updateUserResponse = await axios.post(
            "http://localhost:4200/updateUser",
            {
                "userId": Number(userId),
                "username": username,
            },
            { withCredentials: true }
        )

        if( updateUserResponse.status === 200 ){
            setUpdateUserDetails(!updateUserDetails);
            console.log("User updated successfully: ", updateUserResponse.data);
        }
        else{
            console.log("Error in the try part");
        }

      }
      catch (error) {
        console.error("Error while updating the username: ", error);
      }

      setIsOpen(false)
      setUsername('')
    }
  
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
                variant="outline" 
                className="w-[70%] bg-blue-600/20 hover:bg-blue-950 transition-all delay-75 ease-linear border-2 border-blue-400/20 text-white hover:text-white text-xs tracking-wide font-bold py-2 px-4 rounded-md">
              Edit Details
            </Button>
          </DialogTrigger>
          <DialogContent className="h-96 flex flex-col gap-y-10 justify-center items-center bg-black text-white rounded-xl border-2 border-gray-800">
            <DialogHeader className="w-full flex flex-col justify-center items-center gap-y-2">
              <DialogTitle>Enter Your New Username</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please choose a unique username
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-2 border-gray-800 focus-within:outline-none bg-transparent text-gray-100 focus-within:bg-gray-800 focus-within:border-2 focus-within:border-gray-800"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-gray-900 hover:bg-gray-200">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
    )
}

export default UpdateUserDialog
