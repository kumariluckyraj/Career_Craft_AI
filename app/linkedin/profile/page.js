"use client";

import { useEffect, useState } from "react";

export default function LinkedInPage() {
  /* ==================== STATES ==================== */
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ==================== FETCH TECH STACK ==================== */
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch("/api/user/tech", {
          credentials: "include",
        });

        if (!res.ok) return;
        const json = await res.json();
        setTechStack(json.techStack || []);
      } catch (err) {
        console.error("Failed to load tech stack", err);
      }
    };

    fetchTechStack();
  }, []);

  /* ==================== SAVE TECH STACK ==================== */
  const saveTechStack = async (updatedStack) => {
    try {
      await fetch("/api/user/tech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ techStack: updatedStack }),
      });
    } catch (err) {
      console.error("Failed to save tech stack", err);
    }
  };

  /* ==================== ADD TECH ==================== */
  const addTech = async () => {
    const tech = techInput.trim();
    if (!tech || techStack.includes(tech)) return;

    const updated = [...techStack, tech];
    setTechStack(updated);
    setTechInput("");
    await saveTechStack(updated);
  };

  /* ==================== REMOVE TECH ==================== */
  const removeTech = async (tech) => {
    const updated = techStack.filter((t) => t !== tech);
    setTechStack(updated);
    await saveTechStack(updated);
  };

  /* ==================== GEMINI AI GENERATION ==================== */
  const generateHeadlineAndBio = async () => {
    if (!techStack.length) {
      setError("Please add at least one technology.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack }),
      });

      if (!res.ok) throw new Error("AI generation failed");

      const data = await res.json();
      setHeadline(data.headline || "");
      setBio(data.bio || "");
    } catch (err) {
      console.error(err);
      setError("Failed to generate profile using AI.");
    } finally {
      setLoading(false);
    }
  };

  /* ==================== UI ==================== */
  return (
    <div className="min-h-screen p-6 mt-20 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        LinkedIn Profile Generator
      </h1>

      {/* ===== TECH STACK INPUT ===== */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Add Technology
        </label>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. React, Node.js, Python"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTech}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* ===== TECH STACK LIST ===== */}
      <div className="flex flex-wrap gap-2 mb-6">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
          >
            {tech}
            <button
              onClick={() => removeTech(tech)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* ===== AI BUTTON ===== */}
      <button
        onClick={generateHeadlineAndBio}
        disabled={loading}
        className="mb-6 px-5 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Generating with AI..." : "Generate with Gemini AI"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* ===== HEADLINE ===== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          LinkedIn Headline
        </label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Your AI-generated headline"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ===== BIO ===== */}
      <div>
        <label className="block text-sm font-medium mb-1">
          LinkedIn Bio
        </label>
        <textarea
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Your AI-generated bio"
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
