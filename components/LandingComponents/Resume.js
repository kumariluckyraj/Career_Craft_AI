"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function ResumePage() {
  const { data: session } = useSession();
  const protectedLink = (href) => (session ? href : "/login");
  return (
    <div className="min-h-screen bg-gradient-to-br pt-20 pb-10 from-[#fdfbfb] via-[#ebedee] to-[#f7f8f8] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/10 rounded-3xl shadow-xl p-8 sm:p-12">
          
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            AI Resume Studio
          </h1>
          <p className="text-center text-black/60 mt-4 max-w-2xl mx-auto">
            Build resumes that actually get shortlisted.  
            Our AI analyzes, improves, and generates job-ready resumes
            tailored to your skills, experience, and career goals.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="rounded-2xl border border-black/10 bg-white/60 p-5 text-center">
              <div className="text-lg font-semibold">Smart Analysis</div>
              <p className="text-sm text-black/60 mt-2">
                Get instant feedback on structure, clarity, and impact.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/60 p-5 text-center">
              <div className="text-lg font-semibold">AI Generation</div>
              <p className="text-sm text-black/60 mt-2">
                Generate polished resumes tailored to roles & industries.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/60 p-5 text-center">
              <div className="text-lg font-semibold">ATS Friendly</div>
              <p className="text-sm text-black/60 mt-2">
                Optimized to pass Applicant Tracking Systems effortlessly.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-12">
            <Link
              href={protectedLink("/resume/sample")}
              className="group relative inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white transition-all
              bg-black hover:bg-black/90 shadow-lg hover:shadow-2xl"
            >
              <span className="relative z-10">
                Find Best Resumes
              </span>
              <span className="absolute inset-0 rounded-full bg-black-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-xs text-black/50 text-center mt-6">
            Powered by AI • Designed for modern careers
          </p>
        </div>
      </div>
    </div>
  );
}
