'use client';
import { useEffect, useState } from 'react';
//before revert.
export default function GitHubReadme() {
  const [username, setUsername] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
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

const addTech = async () => {
  const tech = techInput.trim();
  if (!tech || techStack.includes(tech)) {
    console.log('No tech added or already exists:', tech);
    return;
  }

  const updated = [...techStack, tech];
  console.log('Updated tech stack (before saving):', updated);

  setTechStack(updated);
  setTechInput('');

  try {
    await saveTechStack(updated);
    console.log('Tech stack saved successfully');
  } catch (err) {
    console.error('Error saving tech stack:', err);
  }
};

const saveTechStack = async (updatedStack) => {
  try {
    const res = await fetch('/api/user/tech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ techStack: updatedStack }),
      credentials: 'include', // important for session
    });
    if (!res.ok) throw new Error('Failed to save tech stack');
    console.log('POST response OK');
  } catch (err) {
    console.error(err);
  }
};


const removeTech = async (tech) => {
  const updated = techStack.filter((t) => t !== tech);
  setTechStack(updated);
  await saveTechStack(updated);
};

  useEffect(() => {
  const fetchTechStack = async () => {
    try {
      const res = await fetch('/api/user/tech', {
  credentials: 'include',
});

      if (!res.ok) return;
      const data = await res.json();
      setTechStack(data.techStack || []);
    } catch (err) {
      console.error('Failed to load tech stack');
    }
  };

  fetchTechStack();
}, []);


  return (
    <div className="p-8 max-w-3xl mt-20 mx-auto">
      <h1 className="text-2xl font-bold mb-4">GitHub README Generator</h1>

      {/* Username */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate README
        </button>
      </div>

      
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Tech Stack</h2>
        <input
          type="text"
          placeholder="Add tech (e.g. React, Next.js)"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={addTech}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Add
        </button>

        <div className="flex flex-wrap gap-2 mt-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
              onClick={() => removeTech(tech)}
              title="Click to remove"
            >
              {tech} ✕
            </span>
          ))}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* README Preview */}
      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">README Preview</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
{`# ${data.name || data.login}

${data.bio || ''}

## ⚙️ Tech Stack
${techStack.length ? techStack.map(t => `- ${t}`).join('\n') : 'Not specified'}

## 📊 GitHub Stats
- Public Repos: ${data.public_repos}
- Followers: ${data.followers}
- Following: ${data.following}

## 🌍 Connect
- GitHub: [${data.login}](${data.html_url})
- Location: ${data.location || 'N/A'}
`}
          </pre>
        </div>
      )}
    </div>
  );
}
