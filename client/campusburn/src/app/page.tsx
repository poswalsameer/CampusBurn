'use client';

import { Button } from "@/components/ui/button";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { SignInButton } from "@clerk/nextjs";
import { CalendarClock } from "lucide-react";
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
        color="#254062"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={dimensions.height}
        width={dimensions.width}
      />

      <div className="
      z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center
      
      sm:z-10 sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex sm:flex-col sm:justify-center
      
      md:z-10 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:flex md:flex-col md:justify-center

      lg:z-10 lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex lg:flex-col lg:justify-center ">
        <div className="
        flex justify-center items-center
        sm:flex sm:justify-center sm:items-center
        md:flex md:justify-center md:items-center
        lg:flex lg:justify-center lg:items-center">
          <h1 className="
          mt-6 text-white font-bold text-4xl
          sm:mt-6 sm:text-white sm:font-bold sm:text-7xl
          md:mt-6 md:text-white md:font-bold md:text-7xl
          lg:mt-6 lg:text-white lg:font-bold lg:text-8xl">
            Campus
            <span className="text-orange-500">Burn</span>
          </h1>
          <img 
          src="./flame.gif" 
          alt="" 
          className="
          h-16 w-16
          sm:h-28 sm:w-28
          md:h-28 md:w-28
          lg:h-32 lg:w-32" />
        </div>

        <div className="

        flex justify-end text-white text-[0.6rem] -mr-3 my-2
        sm:flex sm:justify-end sm:text-white sm:text-base sm:-mr-7 sm:my-2
        md:flex md:justify-end md:text-white md:text-base md:-mr-7 md:my-2
        lg:flex lg:justify-end lg:text-white lg:text-base lg:mr-7 lg:my-2">
          <p className="font-extrabold sm:font-extrabold text-blue-500">
            I hate my college, and I know you hate yours too!
          </p>
        </div>

        <div className="
        text-white font-extrabold text-xl mt-24 flex flex-row justify-center items-center gap-x-3
        sm:text-white sm:font-extrabold sm:text-3xl sm:mt-24 sm:flex sm:flex-row sm:justify-center sm:items-center sm:gap-x-3
        md:text-white md:font-extrabold md:text-3xl md:mt-24 md:flex md:flex-row md:justify-center md:items-center md:gap-x-3
        lg:text-white lg:font-extrabold lg:text-3xl lg:mt-24 lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-x-3">

          LAUNCHING SOON 
          <CalendarClock 
          className="
          h-9 w-9
          sm:h-14 sm:w-14
          md:h-14 md:w-14
          lg:h-16 lg:w-16 text-blue-500 " />
          {/* <Button
          className="h-10 w-28 bg-blue-600 hover:bg-white text-white hover:text-blue-600 font-bold transition-all delay-75 ease-linear rounded-md"
          onClick={() => router.push("/sign-up")}
          >Sign up</Button> */}

          {/* <Button
          className="h-10 w-28 bg-white hover:bg-blue-600 text-blue-600 hover:text-white font-bold transition-all delay-75 ease-linear rounded-md"
          onClick={ () => router.push("/sign-in") }
          >
            Log in
          </Button> */}
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
