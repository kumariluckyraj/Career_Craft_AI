'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function IdeaPage() {
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [projects, setProjects] = useState({});
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

  const fetchProjectIdeas = async () => {
    if (techStack.length === 0) {
      setError('No tech stack found. Please add technologies first.');
      return;
    }

    setLoading(true);
    setError('');
    setProjects({});

    try {
      const res = await fetch('/api/projects/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techStack }),
      });

      if (!res.ok) throw new Error('Failed to fetch project ideas');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
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
              Unique Project Ideas Generator
            </h1>
            <p className="text-gray-600 mt-2">
              Generate premium, placement-ready project ideas tailored to your tech stack.
            </p>
          </div>

          <Link href="/github/projects">
            <button className="bg-black text-white px-5 py-2 rounded-xl hover:opacity-80 shadow-md transition">
              Back to Projects
            </button>
          </Link>
        </motion.div>

        {/* Main Card */}
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
            onClick={fetchProjectIdeas}
            disabled={loading || techStack.length === 0}
            className={`px-6 py-2 rounded-xl text-white font-medium transition shadow-sm ${
              loading || techStack.length === 0
                ? 'bg-gray-400'
                : 'bg-black hover:opacity-90'
            }`}
          >
            {loading ? 'Fetching...' : 'Generate Project Ideas'}
          </button>

          {error && (
            <p className="text-red-500 mt-4 font-medium">{error}</p>
          )}
        </div>

        {/* Results */}
        {Object.keys(projects).length > 0 && (
          <div className="mt-10 space-y-10">
            {techStack.map((tech) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#e8e3d9] rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {tech} Project Ideas
                </h2>

                {projects[tech]?.length === 0 && (
                  <p className="text-gray-500">No projects found.</p>
                )}

                <div className="space-y-4">
                  {projects[tech]?.map((p, idx) => (
                    <div
                      key={idx}
                      className="border border-[#eee7dc] rounded-xl p-5 hover:shadow-md transition"
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {p.title || 'Untitled Project'}
                      </h3>

                      <p className="text-gray-700 mb-2">
                        {p.description || 'No description provided.'}
                      </p>

                     <p className="text-sm text-gray-600 mb-2">
  <span className="font-semibold text-black">Tech Flow:</span>
</p>

<div className="flex flex-wrap gap-2">
  {p.techFlow && typeof p.techFlow === 'object'
    ? Object.entries(p.techFlow).map(([key, value]) => (
        <span
          key={key}
          className="bg-[#f1ebe2] border border-[#e6dfd4] px-3 py-1 rounded-full text-sm"
        >
          {key}: {value}
        </span>
      ))
    : typeof p.techFlow === 'string'
    ? (
      <span className="bg-[#f1ebe2] border border-[#e6dfd4] px-3 py-1 rounded-full text-sm">
        {p.techFlow}
      </span>
    )
    : (
      <span className="text-gray-400 text-sm">N/A</span>
    )}
</div>


                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm font-semibold underline"
                      >
                        {p.source || 'View Source'} →
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
