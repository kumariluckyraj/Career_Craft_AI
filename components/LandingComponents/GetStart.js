"use client";
import Link from "next/link";

const GetStart = () => {
  return (
    <section className="h-[70vh] flex bg-[#FAD7BD] overflow-hidden shadow-lg">
      {/* Left Image */}
      <div
        className="w-1/3 hidden md:block bg-cover bg-center"
        style={{ backgroundImage: "url('/happy.png')" }}
      />

      {/* Right Content */}
      <div className="w-full md:w-2/3 flex flex-col justify-center px-6 md:px-14">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl mx-15 font-serif mb-8 text-black tracking-tight">
          Start your journey 
        </h1>

       {/* Cards */}
<div className="max-w-2xl mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* GitHub */}
    <Link
      href="/github/page"
      className="rounded-2xl bg-white/80 backdrop-blur-md px-5 py-5 border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-[2px]"
    >
      <div className="text-lg font-semibold">GitHub Toolkit</div>
      <p className="text-sm text-black/60 mt-2 leading-relaxed">
        Generate a stunning GitHub profile README, discover repositories based
        on your tech stack, and level up your developer presence — all powered
        by AI.
      </p>
    </Link>

    {/* LinkedIn */}
    <Link
      href="/linkedin/page"
      className="rounded-2xl bg-white/80 backdrop-blur-md px-5 py-5 border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-[2px]"
    >
      <div className="text-lg font-semibold">LinkedIn Growth Hub</div>
      <p className="text-sm text-black/60 mt-2 leading-relaxed">
        Instantly generate bios, profile descriptions, post ideas, pitches, and
        discover high-quality connections to grow your professional network.
      </p>
    </Link>
  </div>

  {/* Resume - centered */}
  <div className="flex justify-center mt-4">
    <Link
      href="/resume/page"
      className="w-full sm:w-1/2 rounded-2xl bg-white/80 backdrop-blur-md px-5 py-5 border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-[2px]"
    >
      <div className="text-lg font-semibold">AI Resume Studio</div>
      <p className="text-sm text-black/60 mt-2 leading-relaxed ">
        Analyze your resume, identify gaps, and generate a polished,
        job-ready resume tailored to your role — powered by AI.
      </p>
    </Link>
  </div>
</div>

      </div>
    </section>
  );
};

export default GetStart;
