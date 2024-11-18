'use client';

import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  return (
    <div
      className="h-screen w-screen flex flex-col justify-center items-center gap-y-24
    
      dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative
    "
      id="bodyBackground"
    >

      <div className="flex flex-col justify-center ">
        <div className="flex justify-center items-center">
          <h1 className="mt-6 text-white font-bold text-8xl">
            Campus
            <span className="text-orange-500">Burn</span>
          </h1>
          <img src="./flame.gif" alt="" className="h-32 w-32" />
        </div>

        <div className="flex justify-end text-white text-base font-semibold mr-7 my-2">
          <p className="text-blue-400">
            I hate my college, and I know you hate yours too!
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-x-7">
        <button
        className="h-10 w-28 bg-blue-600 text-white font-bold rounded-md"

        onClick={() => router.push("/sign-up")}
        >Sign up</button>
        <button
        className="h-10 w-28 bg-white text-blue-600 font-bold rounded-md"
        onClick={ () => router.push("/sign-in") }
        >
          Log in
        </button>
      </div>

    </div>
  );
}

{
  /* <button className="h-12 w-40 bg-blue-500 text-black text-sm font-bold rounded-md" >Sign In</button> */
}

{
  /* Use this button to redirect the user from (get started button/landing page) to the sign in sign up page */
}
{
  /* <SignInButton  /> */
}
