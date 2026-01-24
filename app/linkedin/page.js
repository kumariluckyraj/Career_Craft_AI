'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LinkedInPage() {
  const workflowSteps = [
    'Create LinkedIn Profile',
    'Grow Your Network',
    'LinkedIn AI Assistant',
  ];

  return (
    <main className="min-h-screen bg-[#FDEBD0] text-gray-900 px-6 mt-[84px] flex flex-col items-center">

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
        <h1 className="text-5xl font-bold mb-4">LinkedIn Tools </h1>
        <p className="text-gray-700 text-lg">
          Boost your LinkedIn profile, grow your network, and get AI-powered recommendations effortlessly.
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
        
        {/* Create LinkedIn Profile */}
        <Link href="/linkedin/profile" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">Create LinkedIn Profile</h2>
            <p className="text-gray-700">Generate a professional LinkedIn profile automatically</p>
          </div>
        </Link>

        {/* Grow Your Network */}
        <Link href="/linkedin/ideas/recommendation" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">Grow Your Network</h2>
            <p className="text-gray-700">Get smart connection suggestions and networking tips</p>
          </div>
        </Link>

        {/* LinkedIn AI Assistant */}
        <Link href="/linkedin/profile" className="flex-1">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-bold mb-2">LinkedIn AI Assistant</h2>
            <p className="text-gray-700">Write posts, pitch ideas, and optimize your LinkedIn content</p>
          </div>
        </Link>
      </div>

      {/* Optional Bottom Buttons */}
      <div className="mt-12 flex flex-col md:flex-row gap-4">
        <Link href="/linkedin/profile">
          <button className="bg-purple-200 text-gray-900 px-6 py-2 rounded hover:bg-purple-300 transition">
            Create LinkedIn Profile
          </button>
        </Link>
        <Link href="/linkedin/ideas/recommendation">
          <button className="bg-teal-200 text-gray-900 px-6 py-2 rounded hover:bg-teal-300 transition">
            Grow Your Network
          </button>
        </Link>
        <Link href="/linkedin/profile">
          <button className="bg-pink-200 text-gray-900 px-6 py-2 rounded hover:bg-pink-300 transition">
            LinkedIn AI Assistant
          </button>
        </Link>
      </div>

    </main>
  );
}
