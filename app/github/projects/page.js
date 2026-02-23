'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProjectPage() {
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ==================== LOAD SAVED TECH STACK ==================== */
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch('/api/user/tech', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        setTechStack(json.techStack || []);
      } catch (err) {
        console.error('Failed to load tech stack', err);
      }
    };

    fetchTechStack();
  }, []);

  /* ==================== SAVE TECH STACK ==================== */
  const saveTechStack = async (updatedStack) => {
    try {
      await fetch('/api/user/tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ techStack: updatedStack }),
      });
    } catch (err) {
      console.error('Failed to save tech stack', err);
    }
  };

  const addTech = async () => {
    const tech = techInput.trim();
    if (!tech || techStack.includes(tech)) return;

    const updated = [...techStack, tech];
    setTechStack(updated);
    setTechInput('');
    await saveTechStack(updated);
  };

  const removeTech = async (tech) => {
    const updated = techStack.filter((t) => t !== tech);
    setTechStack(updated);
    await saveTechStack(updated);
  };

  const handleFetch = async () => {
    if (techStack.length === 0) {
      setError('Please add at least one technology');
      return;
    }

    setLoading(true);
    setError('');
    setData({});

    try {
      const results = {};

      for (const tech of techStack) {
        const techQuery = encodeURIComponent(tech.trim().toLowerCase());
        const res = await fetch(`/api/projects?tech=${techQuery}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to fetch projects for ${tech}`);
        results[tech] = await res.json();
      }

      setData(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-black p-6 mt-20 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Placement-Level Project Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Discover rich, industry-level projects curated from GitHub and
              YouTube.
            </p>
          </div>

          <Link href="/github/projects/ideas">
            <button className="bg-black text-white px-5 py-2 rounded-xl hover:opacity-80 shadow-md transition">
              Get Project Ideas
            </button>
          </Link>
        </motion.div>

        {/* Card */}
        <div className="bg-white border border-[#e8e3d9] rounded-2xl p-6 shadow-sm">
          {/* Add Tech */}
          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Add technology (React, Node, MongoDB...)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="border border-[#e5dfd3] focus:border-black outline-none px-4 py-2 rounded-xl w-full bg-[#faf7f2]"
            />
            <button
              onClick={addTech}
              className="bg-[#c7b299] text-black px-5 rounded-xl font-medium hover:bg-[#bda78d] transition"
            >
              Add
            </button>
          </div>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                onClick={() => removeTech(tech)}
                className="bg-[#f1ebe2] border border-[#e6dfd4] px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#e8e0d3]"
                title="Click to remove"
              >
                {tech} ✕
              </motion.span>
            ))}
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetch}
            disabled={loading}
            className={`px-6 py-2 rounded-xl text-white font-medium transition shadow-sm ${
              loading
                ? 'bg-gray-400'
                : 'bg-black hover:opacity-90'
            }`}
          >
            {loading ? 'Loading...' : 'Get Projects'}
          </button>

          {error && (
            <p className="text-red-500 mt-4 font-medium">{error}</p>
          )}
        </div>

        {/* Results */}
        {Object.keys(data).length > 0 && (
          <div className="mt-10 space-y-10">
            {techStack.map((tech) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#e8e3d9] rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-3">
                  {tech} Projects
                </h2>

                {/* GitHub */}
                {data[tech]?.github?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 text-gray-700">
                      GitHub Repositories
                    </h3>

                    <ul className="space-y-3">
                      {data[tech].github.map((repo) => (
                        <li
                          key={repo.url}
                          className="border border-[#eee7dc] rounded-xl p-4 hover:shadow-md transition"
                        >
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline"
                          >
                            {repo.name}
                          </a>

                          {repo.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {repo.description.length > 150
                                ? repo.description.slice(0, 150) + '...'
                                : repo.description}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* YouTube */}
                {data[tech]?.youtube?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3 text-gray-700">
                      YouTube Tutorials
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {data[tech].youtube.map((video) => {
                        const videoId = video.url.split('v=')[1];
                        return (
                          <div
                            key={video.url}
                            className="border border-[#eee7dc] rounded-xl overflow-hidden hover:shadow-md transition"
                          >
                            <iframe
                              className="w-full h-60"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title}
                              allowFullScreen
                            />

                            <p className="p-3 text-sm font-medium">
                              {video.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
