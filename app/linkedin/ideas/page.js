"use client";

import { useEffect, useState } from "react";

export default function LinkedInAIPage() {
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [postIdeas, setPostIdeas] = useState(null);
  const [generatedPost, setGeneratedPost] = useState("");
  const [pitch, setPitch] = useState("");
  const [networking, setNetworking] = useState(null);

  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");

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

  /* ==================== COMMON PROFILE ==================== */
  const profile = {
    techStack,
    role: "student",
    goal: "internship and learning",
  };

  /* ==================== AI CALL HELPER ==================== */
 const callAI = async (endpoint, body, setter) => {
  setLoading(true);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", text);
      alert(`API Error: ${res.status}`);
      return;
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Not JSON:", text);
      alert("API did not return JSON. Check backend.");
      return;
    }

    const data = await res.json();
    console.log("AI response:", data);
    setter(data);
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Request failed. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">LinkedIn AI Mentor (Students)</h1>

      {/* ================= TECH STACK ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your Tech Stack</h2>

        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add tech (React, Python...)"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={addTech}
            className="bg-black text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="bg-gray-200 px-3 py-1 rounded cursor-pointer"
              onClick={() => removeTech(tech)}
            >
              {tech} ✕
            </span>
          ))}
        </div>
      </section>

      {/* ================= ANALYZE ================= */}
      <section className="space-y-2">
        <button
          onClick={() =>
            callAI("/api/ai/student/analyze", { profile }, setAnalysis)
          }
          className="btn"
        >
          Analyze Profile
        </button>

        {analysis && (
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        )}
      </section>

      {/* ================= POST IDEAS ================= */}
      <section className="space-y-2">
        <button
          onClick={() =>
            callAI("/api/ai/student/post-ideas", { profile }, setPostIdeas)
          }
          className="btn"
        >
          Generate Post Ideas
        </button>

        {postIdeas && (
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(postIdeas, null, 2)}
          </pre>
        )}
      </section>

     

      {/* ================= PITCH ================= */}
      <section className="space-y-2">
        <button
          onClick={() =>
            callAI("/api/ai/student/pitch", { profile }, (d) => setPitch(d.pitch))
          }
          className="btn"
        >
          Generate DM Pitch
        </button>

        {pitch && (
          <div className="bg-gray-100 p-4 rounded whitespace-pre-line">
            {pitch}
          </div>
        )}
      </section>

    

      {loading && <p className="text-sm text-gray-500">Thinking…</p>}
    </div>
  );
}
