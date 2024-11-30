'use client'

import FlickeringGrid from '@/components/ui/flickering-grid';
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Page() {

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

    <div 
    className='min-h-screen w-full bg-black flex justify-center items-center overflow-x-hidden' 
    ref={parentRef}
    >
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full overflow-x-hidden"
          squareSize={4}
          gridGap={6}
          color="#254062"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={dimensions.height}
          width={dimensions.width}
        />
        <SignUp />
    </div>

  ) 
}