'use client';

import Link from 'next/link';

export default function Home() {
  const sections = [
    {
      title: 'GitHub',
      description: 'Generate README files and get project ideas',
      href: '/github',
      gradient: 'from-gray-700 to-gray-900',
    },
    {
      title: 'LinkedIn',
      description: 'Optimize your profile and generate posts',
      href: '/linkedin',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      title: 'LeetCode',
      description: 'Track progress and get practice recommendations',
      href: '/leetcode',
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Resume',
      description: 'Build and customize your resume',
      href: '/resume',
      gradient: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Developer Toolkit 🚀
        </h1>
        <p className="text-gray-400 max-w-xl">
          All-in-one platform to boost your developer profile — GitHub, LinkedIn,
          LeetCode, and Resume tools in one place.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {sections.map((section) => (
          <Link key={section.title} href={section.href}>
            <div
              className={`cursor-pointer rounded-xl p-6 h-40
              bg-gradient-to-br ${section.gradient}
              hover:scale-105 transition-transform duration-300
              shadow-lg`}
            >
              <h2 className="text-2xl font-semibold mb-2">
                {section.title}
              </h2>
              <p className="text-gray-200 text-sm">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

     

    </main>
  );
}
