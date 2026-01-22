import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative w-full mt-10 h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

     <h1 className="relative z-10 text-white text-[90px] md:text-[170px] font-bold text-center -translate-y-16 md:-translate-y-44">
  CareerCraft AI
</h1>

{/* GitHub Button with Description */}
<div className="absolute  z-10"

style={{ bottom: '185px', left: '152px' }}>
  <Link
    href="/github/page"
    className="block px-6 py-4 rounded-lg bg-black text-white  font-semibold shadow-lg hover:brightness-110 transition max-w-xs text-center"
  >
    <div className="text-lg font-bold">GitHub</div>
    <div className="mt-1 text-sm font-normal">Generate README  and get project ideas</div>
  </Link>
</div>

{/* LinkedIn Button with Description */}
<div className="absolute" style={{ top: '376px', right: '52px' }}>
  <Link
    href="/linkedin/page"
    className="block px-6 py-4 rounded-lg bg-black text-white font-semibold shadow-lg hover:brightness-110 transition max-w-xs text-center"
  >
    <div className="text-lg font-bold">LinkedIn</div>
    <div className="mt-1 text-sm font-normal">Optimize your profile and generate posts</div>
  </Link>
</div>

{/* Resume Button with Description */}
<div className="absolute bottom-16 left-[53%] transform -translate-x-1/2 z-10">
  <Link
    href="/resume/page"
    className="block px-6 py-4 rounded-lg bg-black text-white  font-semibold shadow-lg hover:brightness-110 transition max-w-xs text-center"
  >
    <div className="text-lg font-bold">Resume</div>
    <div className="mt-1 text-sm font-normal">Build and customize your resume</div>
  </Link>

</div>
    </section>
  );
}
