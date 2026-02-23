"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Hero() {
  const { data: session } = useSession();
  const protectedLink = (href) => (session ? href : "/login");

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Heading */}
      <h1 className="relative z-10 pt-20 text-white text-5xl sm:text-7xl md:text-[140px] font-bold text-center mb-10">
        CareerCraft AI
      </h1>

      {/* Buttons Container */}
      <div className="relative z-10 pt-[100px] pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        
        {/* GitHub */}
        <Link
          href={protectedLink("/github")}
          className="px-6 py-5 rounded-xl bg-black/80 backdrop-blur-md text-white 
          font-semibold shadow-xl hover:bg-gray-800 transition text-center"
        >
          <div className="text-lg font-bold">GitHub</div>
          <div className="mt-1 text-sm font-normal">
            Generate README and get project ideas
          </div>
        </Link>

        {/* LinkedIn */}
        <Link
          href={protectedLink("/linkedin")}
          className="px-6 py-5 rounded-xl bg-black/80 backdrop-blur-md text-white 
          font-semibold shadow-xl hover:bg-gray-800 transition text-center"
        >
          <div className="text-lg font-bold">LinkedIn</div>
          <div className="mt-1 text-sm font-normal">
            Optimize your profile and generate posts
          </div>
        </Link>

        {/* Resume */}
        <Link
          href={protectedLink("/resume")}
          className="px-6 py-5 rounded-xl bg-black/80 backdrop-blur-md text-white 
          font-semibold shadow-xl hover:bg-gray-800 transition text-center"
        >
          <div className="text-lg font-bold">Resume</div>
          <div className="mt-1 text-sm font-normal">
            Build and customize your resume
          </div>
        </Link>
      </div>
    </section>
  );
}