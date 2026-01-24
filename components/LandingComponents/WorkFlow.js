import React from "react";
import Link from "next/link";
const OurServices = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center px-6 md:px-16"
      style={{
        backgroundImage: "url('/bg22.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-white">
        <p className="mb-4 font-medium italic text-lg">Our Services</p>

        <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
          A single home for AI-powered career, coding
          <br />
          and professional growth
        </h1>

        <p className="text-base md:text-lg opacity-90 mb-10">
          Our AI-driven tools help individuals build powerful online
          identities, optimize resumes, and grow meaningful professional
          connections — all in one place.
        </p>

        
        <Link href="/login">
      <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition">
        START YOUR JOURNEY
      </button>
    </Link>
      </div>
    </section>
  );
};

export default OurServices;
