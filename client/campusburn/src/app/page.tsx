import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col gap-y-10 justify-center items-center" >
        <button className="h-12 w-40 bg-blue-500 text-black text-sm font-bold rounded-md" >Sign In</button>

        {/* Use this button to redirect the user from (get started button/landing page) to the sign in sign up page */}
        {/* <SignInButton  /> */}
    </div>
  );
}
