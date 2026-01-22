"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [showdropdown, setShowdropdown] = useState(false);
const router = useRouter();

const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Navbar background */}
      <div className="bg-black backdrop-blur-md text-white px-6 py-6 flex items-center justify-between">
        
        {/* LEFT ICONS */}
        <div className="flex items-center gap-5">
          {/* Hamburger */}
          <button className="text-2xl hover:opacity-80 transition">
            ☰
          </button>

       {/* Search */}
<div className="relative px-10">
  {!searchOpen ? (
    <button
      onClick={() => setSearchOpen(true)}
      className="text-white hover:opacity-80 transition"
    >
      <Search size={24} />
    </button>
  ) : (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchOpen(false);
        setSearchQuery("");
      }}
      className="flex items-center gap-2"
    >
      <input
        autoFocus
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-44 md:w-64 px-4 py-2 rounded-full bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/60"
      />

      <button
        type="button"
        onClick={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        className="text-white hover:opacity-80 transition"
      >
        <X size={22} />
      </button>
    </form>
  )}
</div>



        </div>

        {/* CENTER BRAND NAME */}
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-semibold tracking-[0.3em]">
          <Link href="/">CareerCraft AI</Link>
        </div>

        {/* RIGHT BUTTON */}
       {/* RIGHT BUTTON / USER */}
<div className="flex items-center gap-4">
  {session ? (
    <div className="relative">
      <button
        onClick={() => setShowdropdown(!showdropdown)}
        className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition"
      >
        {session.user.email.split("@")[0]}
      </button>

      {showdropdown && (
        <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-xl w-44 overflow-hidden">
          <Link href="/orders">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Orders
            </div>
          </Link>

          <Link href="/learn">
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Learn
            </div>
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link href="/login">
      <button className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition">
        START YOUR JOURNEY
      </button>
    </Link>
  )}
</div>

      </div>
    </nav>
  );
};

export default Navbar;
