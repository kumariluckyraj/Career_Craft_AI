'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';

export default function GitHubReadme() {
  const [username, setUsername] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardRef = useRef(null);

  /* 🔥 Fetch GitHub */
  const handleFetch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/github/user?username=${username}`);
      if (!res.ok) throw new Error('User not found');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 STRICT TECH STACK */
  const addTech = async () => {
    const tech = techInput.trim();

    if (!tech) return;

    // prevent duplicates (case insensitive)
    const exists = techStack.some(
      (t) => t.toLowerCase() === tech.toLowerCase()
    );

    if (exists) {
      setTechInput('');
      return;
    }

    const updated = [...techStack, tech];
    setTechStack(updated);
    setTechInput('');

    await saveTechStack(updated);
  };

  const saveTechStack = async (updatedStack) => {
    await fetch('/api/user/tech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ techStack: updatedStack }),
      credentials: 'include',
    });
  };

  const removeTech = async (tech) => {
    const updated = techStack.filter((t) => t !== tech);
    setTechStack(updated);
    await saveTechStack(updated);
  };

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch('/api/user/tech', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setTechStack(data.techStack || []);
      } catch {}
    };
    fetchTechStack();
  }, []);

  /* 🔥 COPY IMAGE */
  const copyImage = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current);
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);

    alert('Copied! Paste in GitHub README.');
  };

  /* 🔥 DOWNLOAD IMAGE */
  const downloadImage = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current);

    const link = document.createElement('a');
    link.download = 'github-stats.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-black flex items-center justify-center p-6 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 border border-[#e8dfd1]"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">
          GitHub README Generator
        </h1>

      {/* Username */}
<div className="flex gap-2 md:gap-3 mb-5 md:mb-6">
  <input
    type="text"
    placeholder="Enter GitHub username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="flex-1 border px-3 py-2 md:px-4 md:py-3 rounded-md md:rounded-lg text-sm md:text-base"
  />
</div>

{/* Tech stack */}
<div className="mb-6 md:mb-8">
  <h2 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">
    Tech Stack
  </h2>

  {/* Input + button */}
  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
    <input
      value={techInput}
      onChange={(e) => setTechInput(e.target.value)}
      placeholder="Add one tech"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTech();
        }
      }}
      className="flex-1 border px-3 py-2 md:px-4 md:py-3 rounded-md md:rounded-lg text-sm md:text-base"
    />

    <button
      onClick={addTech}
      className="bg-[#e8dfd1] px-4 py-2 md:px-6 md:py-3 rounded-md md:rounded-lg text-sm md:text-base w-full sm:w-auto"
    >
      Add
    </button>
  </div>

  {/* Tech chips */}
  <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
    {techStack.map((tech) => (
      <span
        key={tech}
        className="bg-black text-white px-2.5 py-1 text-xs md:text-sm rounded-full cursor-pointer"
        onClick={() => removeTech(tech)}
      >
        {tech} ✕
      </span>
    ))}
  </div>

  {/* Generate button */}
  <button
    onClick={handleFetch}
    className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 mt-6 md:mt-10 rounded-md md:rounded-lg text-sm md:text-base w-full sm:w-auto"
  >
    Generate
  </button>
</div>

        {loading && <p>Fetching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Preview */}
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl text-center mb-4">Preview</h2>

            <div
              ref={cardRef}
              className="bg-white border rounded-2xl shadow-xl p-8"
            >
              {/* Header */}
              <div className="flex gap-6 border-b pb-6">
                <img
                  src={data.avatar_url}
                  className="w-20 h-20 rounded-full"
                />

                <div>
                  <h3 className="text-2xl font-semibold">
                    {data.name || data.login}
                  </h3>
                  <p>{data.bio}</p>
                  <p className="text-sm text-gray-500">
                    @{data.login}
                  </p>
                </div>
              </div>

              {/* Extra info */}
              <div className="mt-4 text-sm space-y-1">
                {data.location && <p>🌍 {data.location}</p>}
                {data.company && <p>🏢 {data.company}</p>}
                {data.blog && <p>🔗 {data.blog}</p>}
                {data.twitter_username && (
                  <p>🐦 @{data.twitter_username}</p>
                )}
                <p>
                  📅 Joined{' '}
                  {new Date(data.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Tech */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">⚙️ Tech Stack</h4>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-black text-white rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>📦Total Repos: {data.public_repos}</div>
                <div>👥 Followers: {data.followers}</div>
                <div>➕ Following:{data.following}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={copyImage}
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                📋 Copy Card
              </button>

              <button
                onClick={downloadImage}
                className="bg-[#e8dfd1] px-6 py-3 rounded-lg"
              >
                ⬇️ Download Image
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
