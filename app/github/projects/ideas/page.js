'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  /* ==================== ADD/REMOVE TECH ==================== */
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

  /* ==================== FETCH PROJECT IDEAS ==================== */
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

  /* ==================== UI ==================== */
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Unique Project Ideas Generator</h1>

      {/* Button to go back */}
      <Link href="/github/projects">
        <button className="bg-purple-500 text-white px-4 py-2 rounded mb-4 hover:bg-purple-600">
          Back to Projects
        </button>
      </Link>

      {/* Add Tech */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Add tech (React, Node, MongoDB)"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addTech} className="bg-green-500 text-white px-3 py-2 rounded">
          Add
        </button>
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techStack.map((tech) => (
          <span
            key={tech}
            onClick={() => removeTech(tech)}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
            title="Click to remove"
          >
            {tech} ✕
          </span>
        ))}
      </div>

      {/* Fetch Button */}
      <button
        onClick={fetchProjectIdeas}
        disabled={loading || techStack.length === 0}
        className={`px-4 py-2 rounded text-white mb-4 ${
          loading || techStack.length === 0 ? 'bg-gray-400' : 'bg-blue-500'
        }`}
      >
        {loading ? 'Fetching...' : 'Get Project Ideas'}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Display per-tech results */}
      {Object.keys(projects).length > 0 &&
        techStack.map((tech) => (
          <div key={tech} className="mt-6">
            <h2 className="text-xl font-semibold mb-2">{tech} Project Ideas</h2>
            {projects[tech]?.length === 0 && <p>No projects found.</p>}

            {projects[tech]?.map((p, idx) => (
              <div key={idx} className="border p-4 my-2 rounded">
                <h3 className="font-bold">{p.title || 'Untitled Project'}</h3>
                <p>{p.description || 'No description provided.'}</p>
                <p>
                  <strong>Tech Flow:</strong> {p.techFlow || 'N/A'}
                </p>
                <p>
                  <strong>Source:</strong>{' '}
                  <a href={p.link} target="_blank" className="text-blue-600">
                    {p.source || 'Unknown'}
                  </a>
                </p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
