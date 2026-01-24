'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProjectPage() {
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [data, setData] = useState({}); // per-tech results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ==================== LOAD SAVED TECH STACK ==================== */
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch('/api/user/tech', {
          credentials: 'include',
        });
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

  /* ==================== ADD TECH ==================== */
  const addTech = async () => {
    const tech = techInput.trim();
    if (!tech || techStack.includes(tech)) return;

    const updated = [...techStack, tech];
    setTechStack(updated);
    setTechInput('');
    await saveTechStack(updated);
  };

  /* ==================== REMOVE TECH ==================== */
  const removeTech = async (tech) => {
    const updated = techStack.filter((t) => t !== tech);
    setTechStack(updated);
    await saveTechStack(updated);
  };

  /* ==================== FETCH PROJECTS PER TECH ==================== */
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

      // fetch per tech
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

  /* ==================== UI ==================== */
  return (
    <div className="p-8 max-w-6xl mt-20  mx-auto">
     

      <h1 className="text-2xl font-bold mb-4">
  Placement-Level Project Generator
</h1>

{/* Button to go to another page */}
<Link href="/github/projects/ideas">
  <button className="bg-purple-500 text-white px-4 py-2 rounded mb-4 hover:bg-purple-600">
    Get Project Ideas
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
        <button
          onClick={addTech}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
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
        onClick={handleFetch}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-500'
        }`}
      >
        {loading ? 'Loading...' : 'Get Projects'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Results */}
      {Object.keys(data).length > 0 &&
        techStack.map((tech) => (
          <div key={tech} className="mt-8">
            <h2 className="text-xl font-semibold mb-2">{tech} Projects</h2>

            {/* GitHub */}
            {data[tech]?.github?.length > 0 && (
              <>
                <h3 className="font-medium mt-2">GitHub</h3>
                <ul className="list-disc ml-5 space-y-2">
                  {data[tech].github.map((repo) => (
                    <li key={repo.url}>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-sm text-gray-700">
                          {repo.description.length > 150
                            ? repo.description.slice(0, 150) + '...'
                            : repo.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* YouTube */}
            {data[tech]?.youtube?.length > 0 && (
              <>
                <h3 className="font-medium mt-4">YouTube Tutorials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data[tech].youtube.map((video) => {
                    const videoId = video.url.split('v=')[1];
                    return (
                      <div key={video.url}>
                        <iframe
                          className="w-full h-64"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <p className="mt-2 text-sm font-medium">{video.title}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
