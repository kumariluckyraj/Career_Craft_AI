'use client';
import { useState } from 'react';

export default function ProjectPage() {
  const [tech, setTech] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/projects?tech=${tech}`);
      if (!res.ok) throw new Error('No projects found');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Project Idea Generator</h1>

      <input
        type="text"
        placeholder="Enter tech stack (e.g., React, Node.js)"
        value={tech}
        onChange={(e) => setTech(e.target.value)}
        className="border p-2 mr-2 rounded"
      />
      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Projects
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">GitHub Repos</h2>
          <ul className="list-disc ml-5">
            {data.github.map((repo) => (
              <li key={repo.url}>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {repo.name}
                </a>: {repo.description}
              </li>
            ))}
          </ul>

         <h2 className="text-xl font-semibold mt-4 mb-2">YouTube Tutorials</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {data.youtube.map((video) => {
    const videoId = video.url.split('v=')[1]; // extract the ID from the URL
    return (
      <div key={video.url} className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <p className="mt-2 text-sm font-medium">{video.title}</p>
      </div>
    );
  })}
</div>


        </div>
      )}
    </div>
  );
}
