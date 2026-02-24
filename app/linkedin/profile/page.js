"use client";

import { useEffect, useState } from "react";

export default function LinkedInPage() {

  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


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

  const addTech = async () => {
    const tech = techInput.trim();
    if (!tech || techStack.includes(tech)) return;

    const updated = [...techStack, tech];
    setTechStack(updated);
    setTechInput("");
    await saveTechStack(updated);
  };

  const removeTech = async (tech) => {
    const updated = techStack.filter((t) => t !== tech);
    setTechStack(updated);
    await saveTechStack(updated);
  };

  
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


  return (
  <div className="min-h-screen bg-gradient-to-br from-amber-50 via-neutral-50 to-stone-100 py-[100px] px-6">
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-neutral-200">
  
      <h1 className="text-3xl font-serif font-semibold text-neutral-900 mb-8 border-b border-neutral-200 pb-3">
        LinkedIn Profile Generator
      </h1>

     {/* ===== TECH STACK INPUT ===== */}
<div className="mb-6 md:mb-7">
  <label className="block text-sm font-medium text-neutral-700 mb-2">
    Add Technology
  </label>

  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
    <input
      value={techInput}
      onChange={(e) => setTechInput(e.target.value)}
      placeholder="e.g. React, Node.js, Python"
      className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base rounded-md md:rounded-lg border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />

    <button
      onClick={addTech}
      className="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base rounded-md md:rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-sm w-full sm:w-auto"
    >
      Add
    </button>
  </div>
</div>
      {/* ===== TECH STACK LIST ===== */}
      <div className="flex flex-wrap gap-2 mb-7">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-full text-sm font-medium"
          >
            {tech}
            <button
              onClick={() => removeTech(tech)}
              className="text-amber-800 hover:text-red-500 font-bold transition"
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
        className="mb-7 px-6 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition shadow-md"
      >
        {loading ? "Generating with AI..." : " Generate with AI"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mb-5">{error}</p>
      )}

      {/* ===== HEADLINE ===== */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          LinkedIn Headline
        </label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Your AI-generated headline"
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {/* ===== BIO ===== */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          LinkedIn Bio
        </label>
        <textarea
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Your AI-generated bio"
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-amber-200"
        />
      </div>
    </div>
  </div>
);
}
