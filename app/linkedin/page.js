'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GitHubPage() {
  const options = [
    {
      title: 'Generate README',
      description: 'Create a professional GitHub README in seconds',
      href: '/github/readme',
      gradient: 'from-purple-600 to-indigo-700',
    },
    {
      title: 'Project Ideas',
      description: 'Get project ideas based on your tech stack',
      href: '/github/projects',
      gradient: 'from-teal-500 to-emerald-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-gray-400 hover:text-white mb-10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-3">GitHub Tools 🐙</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Improve your GitHub profile with automated README generation
          and smart project ideas.
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto">
        {options.map((option) => (
          <Link key={option.title} href={option.href} className="flex-1">
            <div
              className={`h-48 rounded-xl p-6 cursor-pointer
              bg-gradient-to-br ${option.gradient}
              hover:scale-105 transition-transform duration-300
              shadow-lg`}
            >
              <h2 className="text-2xl font-semibold mb-3">
                {option.title}
              </h2>
              <p className="text-gray-200">
                {option.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </main>
  );
}
