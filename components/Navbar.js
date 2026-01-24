'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    {
      title: 'GitHub',
      sub: [
        { title: 'Create My README', href: '/github/readme' },
        { title: 'Get Projects', href: '/github/projects' },
        { title: 'Get Project Ideas', href: '/github/projects/ideas' },
      ],
    },
    {
      title: 'LinkedIn',
      sub: [
        { title: 'Create LinkedIn Profile', href: '/linkedin/profile' },
        { title: 'Grow Your Network', href: '/linkedin/ideas/recommendation' },
        { title: 'LinkedIn AI Assistant', href: '/linkedin/profile' },
      ],
    },
    {
      title: 'Resume',
      sub: [
        { title: 'Build Resume', href: '/resume/build' },
        { title: 'Analyze Resume', href: '/resume/analyze' },
        { title: 'View Sample Resume', href: '/resume/sample' },
      ],
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="bg-black backdrop-blur-md text-white px-6 py-6 flex items-center justify-between">

          {/* LEFT: Hamburger + Search */}
          <div className="flex items-center gap-5">
            {/* Hamburger */}
            <button
              className="text-2xl hover:opacity-80 transition"
              onClick={() => setSidebarOpen(true)}
            >
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

          {/* CENTER: Brand */}
          <div className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-semibold tracking-[0.3em]">
            <Link href="/">CareerCraft AI</Link>
          </div>

          {/* RIGHT: User / Login */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition"
                >
                  {session.user.email.split("@")[0]}
                </button>
                {showDropdown && (
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

      {/* SIDEBAR */}
      {sidebarOpen && (
        <>
          {/* Sidebar Panel */}
          <div
            className="fixed top-[76px] bottom-4 left-4 w-64
                       bg-white/80 backdrop-blur-2xl
                       border border-gray-300
                       shadow-[0_12px_32px_rgba(0,0,0,0.15)]
                       p-6 z-[2000]
                       overflow-y-auto flex flex-col gap-6
                       rounded-r-3xl
                       transition-transform duration-300 transform translate-x-0
                       [scrollbar-width:none]
                       [::-webkit-scrollbar]:hidden
                       [-ms-overflow-style:none]
                       h-[calc(100vh-76px-16px)]"
          >
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="self-end text-2xl font-bold text-gray-700 hover:text-gray-900 transition"
            >
              ✕
            </button>

            {menu.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <div className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1">
                  {section.title}
                </div>
                <div className="flex flex-col ml-2 gap-2">
                  {section.sub.map((sub) => (
                    <Link
                      key={sub.title}
                      href={sub.href}
                      className="px-4 py-2 rounded-lg hover:bg-gradient-to-r from-purple-100 to-indigo-100 text-gray-800 font-medium transition-all shadow-sm hover:shadow-md"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-[1000] backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </>
      )}
    </>
  );
}
