'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ResumeHubPage() {
  const workflowSteps = [
    'Build Resume',
    'Analyze Resume',
    'View Sample Resume',
  ];

  return (
    <main className="min-h-screen bg-[#FCEED9] text-gray-900 px-6 mt-[84px] flex flex-col items-center">

      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 self-start"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">📄 Resume Hub</h1>
        <p className="text-gray-700 text-lg">
          Build, analyze, and explore sample resumes effortlessly with AI-powered tools.
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
        {workflowSteps.map((step, idx) => (
          <div key={step} className="flex items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 text-gray-900 font-bold text-lg shadow-md">
              {idx + 1}
            </div>
            <span className="ml-3 text-lg font-medium">{step}</span>
            {idx !== workflowSteps.length - 1 && (
              <span className="mx-4 hidden md:block text-gray-400 font-bold text-2xl">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Main Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center">
        
        {/* Build Resume */}
        <Link href="/resume/build" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">Build AI Resume</h2>
            <p className="text-gray-700">Create a professional resume quickly with AI assistance</p>
          </div>
        </Link>

        {/* Analyze Resume */}
        <Link href="/resume/analyze" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">Analyze Resume</h2>
            <p className="text-gray-700">Get insights on your resume and suggestions for improvement</p>
          </div>
        </Link>

        {/* View Sample Resume */}
        <Link href="/resume/sample" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">View Sample Resume</h2>
            <p className="text-gray-700">Explore sample resumes for inspiration and guidance</p>
          </div>
        </Link>
      </div>

      {/* Optional Bottom Buttons */}
      <div className="mt-12 flex flex-col md:flex-row gap-4">
        <Link href="/resume/build">
          <button className="bg-purple-200 text-gray-900 px-6 py-2 rounded hover:bg-purple-300 transition">
            Build Resume
          </button>
        </Link>
        <Link href="/resume/analyze">
          <button className="bg-teal-200 text-gray-900 px-6 py-2 rounded hover:bg-teal-300 transition">
            Analyze Resume
          </button>
        </Link>
        <Link href="/resume/sample">
          <button className="bg-pink-200 text-gray-900 px-6 py-2 rounded hover:bg-pink-300 transition">
            View Sample Resume
          </button>
        </Link>
      </div>

    </main>
  );
}
