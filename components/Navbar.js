'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useEffect } from 'react';
export default function Navbar() {
  const { data: session } = useSession();
   const protectedLink = (href) => (session ? href : "/login");
  const router = useRouter();
const [showPostIdeaReminder, setShowPostIdeaReminder] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
  const fetchReminder = async () => {
    try {
      const res = await fetch("/api/strategy/reminder");
      if (!res.ok) return;
      const data = await res.json();
      setShowPostIdeaReminder(data.showReminder);
    } catch (err) {
      console.error("Reminder fetch failed", err);
    }
  };

  fetchReminder();

  const interval = setInterval(fetchReminder, 60 * 1000);
  return () => clearInterval(interval);
}, []);

  const menu = [
    {
      title: 'GitHub',
      sub: [
        { title: 'Create My README', href: protectedLink('/github/readme') },
        { title: 'Get Projects', href: protectedLink('/github/projects') },
        { title: 'Get Project Ideas', href: protectedLink('/github/projects/ideas') },
      ],
    },
    {
      title: 'LinkedIn',
      sub: [
        { title: 'Create LinkedIn Profile', href: protectedLink('/linkedin/profile') },
        { title: 'Grow Your Network', href: protectedLink('/linkedin/ideas/recommendation') },
        { title: 'LinkedIn AI Assistant', href: protectedLink('/linkedin/ideas') },
      ],
    },
    {
      title: 'Resume',
      sub: [
        { title: 'Build Resume', href: protectedLink('/resume/build') },
        { title: 'Analyze Resume', href: protectedLink('https://resume-ats-tracking.streamlit.app/') },
        { title: 'View Sample Resume', href: protectedLink('/resume/sample') },
      ],
    },
  ];

  return (
  <>
    {/* NAVBAR */}
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="bg-black backdrop-blur-md text-white px-3 md:px-6 py-3 md:py-5 flex items-center justify-between">

        {/* LEFT: Hamburger + Bell + Search */}
        <div className="flex items-center gap-3 md:gap-4 relative">

          {/* Hamburger */}
          <button
            className="text-xl md:text-2xl hover:opacity-80 transition"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* Reminder Bell */}
          {session && (
            <div className="relative">
              <button
                onClick={() => router.push(protectedLink("/linkedin/ideas"))}
                className="text-white hover:opacity-80 transition text-lg md:text-xl"
              >
                🔔
              </button>

              {showPostIdeaReminder && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] px-1 rounded-full font-bold">
                  !
                </span>
              )}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:opacity-80 transition"
              >
                <Search size={20} />
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
                className="flex items-center gap-1"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 md:w-60 px-3 py-1.5 rounded-full bg-white text-black text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-white"
                >
                  <X size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CENTER: Brand (responsive fix) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block text-lg md:text-3xl font-semibold tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">
  <Link href="/">CareerCraft AI</Link>
</div>

        {/* RIGHT: User */}
        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-white text-black px-3 md:px-6 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-sm hover:bg-gray-200 transition max-w-[100px] md:max-w-none truncate"
              >
                {session.user.email.split("@")[0]}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-xl w-44 overflow-hidden">
                  <Link href={protectedLink("/github")}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Github
                    </div>
                  </Link>

                  <Link href={protectedLink("/resume")}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Resume
                    </div>
                  </Link>

                  <Link href={protectedLink("/linkedin")}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      LinkedIn
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
              <button className="bg-white text-black px-3 md:px-6 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-sm hover:bg-gray-200 transition">
                START
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>

    {/* SIDEBAR */}
    {sidebarOpen && (
      <>
        <div
          className="fixed top-[60px] md:top-[76px] bottom-4 left-2 md:left-4 w-[85%] max-w-64
          bg-white/90 backdrop-blur-2xl border border-gray-300
          shadow-xl p-5 z-[2000] overflow-y-auto flex flex-col gap-6
          rounded-2xl md:rounded-r-3xl"
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="self-end text-xl font-bold text-gray-700"
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
                    className="px-4 py-2 rounded-lg hover:bg-gradient-to-r from-purple-100 to-indigo-100"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="fixed inset-0 bg-black/30 z-[1000]"
          onClick={() => setSidebarOpen(false)}
        ></div>
      </>
    )}
  </>
);
}
