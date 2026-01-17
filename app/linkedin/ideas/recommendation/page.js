"use client";

import { useEffect, useState } from "react";

export default function LinkedInAIPage() {
  /* ==================== STATE ==================== */
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [personas, setPersonas] = useState(null);
  const [queries, setQueries] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ==================== PROFILE ==================== */
  const profile = {
    role: "student",
    goal: "internship and learning",
    techStack,
  };

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

  /* ==================== AI CALL ==================== */
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
        alert("API error. Check console.");
        return;
      }

      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  };

  /* ==================== UI ==================== */
  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">
        LinkedIn AI Mentor <span className="text-gray-500">(Students)</span>
      </h1>

      {/* ================= TECH STACK ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your Tech Stack</h2>

        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, Node, Python..."
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
              onClick={() => removeTech(tech)}
              className="bg-gray-200 px-3 py-1 rounded cursor-pointer hover:bg-red-200"
            >
              {tech} ✕
            </span>
          ))}
        </div>
      </section>

      {/* ================= STEP 1 ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Who should you connect with?</h2>

        <button
          onClick={() =>
            callAI("/api/ai/student/personas", { profile }, setPersonas)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Target Personas
        </button>

        {personas && (
          <div className="grid md:grid-cols-2 gap-4">
            {personas.personas.map((p, i) => (
              <div key={i} className="border p-4 rounded">
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-gray-600">{p.companyType}</p>
                <p className="text-sm mt-2">{p.why}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= STEP 2 ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          2. LinkedIn Search Queries (copy & paste)
        </h2>

        <button
          disabled={!personas}
          onClick={() =>
            callAI(
              "/api/ai/student/search-queries",
              { profile, personas },
              setQueries
            )
          }
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Generate Search Queries
        </button>

        {queries && (
          <div className="space-y-2">
            {queries.queries.map((q, i) => (
              <div key={i} className="bg-gray-100 p-3 rounded">
                <p className="font-semibold">{q.persona}</p>
                <p className="font-mono text-sm">{q.query}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= STEP 3 ================= */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          3. How to approach them (strategy)
        </h2>

        <button
          disabled={!personas}
          onClick={() =>
            callAI(
              "/api/ai/student/recommendations",
              { profile, personas },
              setRecommendations
            )
          }
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Generate Networking Strategy
        </button>

        {recommendations && (
          <div className="space-y-3">
            {recommendations.recommendations.map((r, i) => (
              <div key={i} className="border p-4 rounded">
                <p className="font-semibold">{r.persona}</p>
                <p className="text-sm mt-1">
                  ✅ <b>Do:</b> {r.action}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  ❌ <b>Avoid:</b> {r.mistakeToAvoid}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {loading && (
        <p className="text-sm text-gray-500 animate-pulse">
          AI is thinking…
        </p>
      )}
    </div>
  );
}
