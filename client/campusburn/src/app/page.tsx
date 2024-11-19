'use client';

import { Button } from "@/components/ui/button";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const router = useRouter()
  const parentRef = useRef< HTMLDivElement | null >(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        setDimensions({
          width: parentRef.current.offsetWidth,
          height: parentRef.current.offsetHeight
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden "
      id="bodyBackground"
      ref={parentRef} >
      <FlickeringGrid
        className="z-0 absolute inset-0 size-full overflow-x-hidden "
        squareSize={4}
        gridGap={4}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={dimensions.height}
        width={dimensions.width}
      />

      <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center ">
        <div className="flex justify-center items-center">
          <h1 className="mt-6 text-white font-bold text-8xl">
            Campus
            <span className="text-orange-500">Burn</span>
          </h1>
          <img src="./flame.gif" alt="" className="h-32 w-32" />
        </div>

        <div className="flex justify-end text-white text-base mr-7 my-2">
          <p className="font-bold text-blue-500">
            I hate my college, and I know you hate yours too!
          </p>
        </div>

        <div className=" mt-20 flex justify-center items-center gap-x-7">
          <Button
          className="h-10 w-28 bg-blue-600 hover:bg-white text-white hover:text-blue-600 font-bold transition-all delay-75 ease-linear rounded-md"
          onClick={() => router.push("/sign-up")}
          >Sign up</Button>

          <Button
          className="h-10 w-28 bg-white hover:bg-blue-600 text-blue-600 hover:text-white font-bold transition-all delay-75 ease-linear rounded-md"
          onClick={ () => router.push("/sign-in") }
          >
            Log in
          </Button>
      </div>

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
