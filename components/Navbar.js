"use client"

import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setShowdropdown] = useState(false)
 
  return (
    <nav className="bg-green-500 text-white px-2 py-4 shadow-md flex justify-between items-center flex-wrap ">
      <div className="text-2xl font-bold">
        <Link href="/">
       
        EquiCraft</Link>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
        <Link href="/"><span className="font-bold text-lg hover:underline">Home</span></Link>
        <Link href="/"><span className="font-bold text-lg hover:underline">Sell</span></Link>
        
        <Link href="/"><span className="font-bold text-lg hover:underline">Cart</span></Link>
        <Link href="/"><span className="font-bold text-lg hover:underline">Shop Now</span></Link>
        <Link href="/"><span className="font-bold text-lg hover:underline">Insight</span></Link>
        <Link href="/"><span className="font-bold text-lg hover:underline">Working</span></Link>
       
        
        
        
        
        <div className="relative ml-4">
          {session ? (
            <>
             <button
  onClick={() => setShowdropdown(!showdropdown)}
  className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-green-100"
>
  Welcome {session.user.email.split('@')[0]}
  <svg className="w-3 h-3" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</button>


              <div
  className={`absolute top-12 right-0 bg-white text-green-800 shadow-lg rounded-lg w-44 z-50 ${
    showdropdown ? '' : 'hidden'
  }`}
  onMouseDown={(e) => e.preventDefault()} // Prevent dropdown from disappearing before click
>
  <ul className="divide-y divide-green-200">
   
    <li>
      <Link href="/">
        <span className="block px-4 py-2 hover:bg-green-100">Orders</span>
      </Link>
    </li>
    <li>
      <Link href="/">
        <span className="block px-4 py-2 hover:bg-green-100">Learn</span>
      </Link>
    </li>
    <li>
      <button
        onClick={() => signOut()}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Sign out
      </button>
    </li>
  </ul>
</div>

            </>
          ) : (
            <Link href="/">
              <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
