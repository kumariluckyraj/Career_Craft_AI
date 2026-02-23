"use client";

import { useEffect, useState } from "react";

export default function LinkedInAIPage() {
  /* ==================== STATE ==================== */
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [personas, setPersonas] = useState(null);
  const [queries, setQueries] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

 

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

  const [loadingPersonas, setLoadingPersonas] = useState(false);
const [loadingQueries, setLoadingQueries] = useState(false);
const [loadingStrategy, setLoadingStrategy] = useState(false);

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
  const callAI = async (endpoint, body, setter, setLoadingState) => {
  setLoadingState(true);

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
    setLoadingState(false);
  }
};
  /* ==================== UI ==================== */
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 pt-40 to-gray-100 p-6">
    <div className="max-w-6xl mx-auto space-y-10">

      {/* ===== HEADER ===== */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h1 className="text-4xl font-bold tracking-tight">
          LinkedIn AI Mentor
          <span className="text-gray-400 ml-2 text-xl">(Students)</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Discover who to connect with, how to search, and how to approach them — powered by AI.
        </p>
      </div>

      {/* ================= TECH STACK ================= */}
      <section className="bg-white shadow-md rounded-2xl p-6 border space-y-4">
        <h2 className="text-2xl font-semibold">Your Tech Stack</h2>

        <div className="flex gap-3">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, Node, Python..."
            className="border px-4 py-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition"
          />
          <button
            onClick={addTech}
            className="bg-black text-white px-6 rounded-xl hover:bg-gray-800 transition shadow"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              onClick={() => removeTech(tech)}
              className="bg-gradient-to-r from-gray-200 to-gray-100 px-4 py-2 rounded-full cursor-pointer hover:from-red-100 hover:to-red-200 transition shadow-sm"
            >
              {tech} ✕
            </span>
          ))}
        </div>
      </section>

      {/* ================= STEP 1 ================= */}
      <section className="bg-white shadow-md rounded-2xl p-6 border space-y-4">
        <h2 className="text-2xl font-semibold">
          1. Who should you connect with?
        </h2>

        <button
          disabled={loadingPersonas}
          onClick={() =>
            callAI(
              "/api/ai/student/personas",
              { profile },
              setPersonas,
              setLoadingPersonas
            )
          }
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl shadow disabled:opacity-50"
        >
          {loadingPersonas ? "Generating..." : "Generate Target Personas"}
        </button>

        {loadingPersonas && (
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-28 bg-gray-200 rounded-xl" />
            <div className="h-28 bg-gray-200 rounded-xl" />
          </div>
        )}

        {personas && (
          <div className="grid md:grid-cols-2 gap-6">
            {personas.personas.map((p, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-gray-50 border rounded-xl p-5 shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-lg">{p.title}</p>
                <p className="text-sm text-gray-500">{p.companyType}</p>
                <p className="text-sm mt-3 text-gray-700">{p.why}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= STEP 2 ================= */}
      <section className="bg-white shadow-md rounded-2xl p-6 border space-y-4">
        <h2 className="text-2xl font-semibold">
          2. LinkedIn Search Queries
        </h2>

        <button
          disabled={!personas || loadingQueries}
          onClick={() =>
            callAI(
              "/api/ai/student/search-queries",
              { profile, personas },
              setQueries,
              setLoadingQueries
            )
          }
          className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-xl shadow disabled:opacity-50"
        >
          {loadingQueries ? "Generating..." : "Generate Search Queries"}
        </button>

        {loadingQueries && (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-xl" />
            <div className="h-16 bg-gray-200 rounded-xl" />
          </div>
        )}

        {queries && (
          <div className="space-y-3">
            {queries.queries.map((q, i) => (
              <div
                key={i}
                className="bg-gray-50 border p-4 rounded-xl shadow-sm hover:shadow transition"
              >
                <p className="font-semibold">{q.persona}</p>
                <p className="font-mono text-sm text-gray-700 mt-1">
                  {q.query}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= STEP 3 ================= */}
      <section className="bg-white shadow-md rounded-2xl p-6 border space-y-4 ">
        <h2 className="text-2xl font-semibold ">
          3. Networking Strategy
        </h2>

        <button
          disabled={!personas || loadingStrategy}
          onClick={() =>
            callAI(
              "/api/ai/student/recommendations",
              { profile, personas },
              setRecommendations,
              setLoadingStrategy
            )
          }
          className="bg-pink-800 text-gray-900 px-6 py-2 rounded hover:bg-pink-700 transition text-white px-6 py-3 rounded-xl shadow disabled:opacity-50"
        >
          {loadingStrategy ? "Generating..." : "Generate Strategy"}
        </button>

        {loadingStrategy && (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-gray-200 rounded-xl" />
            <div className="h-20 bg-gray-200 rounded-xl" />
          </div>
        )}

        {recommendations && (
          <div className="space-y-4">
            {recommendations.recommendations.map((r, i) => (
              <div
                key={i}
                className="border rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-lg">{r.persona}</p>
                <p className="text-sm mt-2 text-green-700">
                  <b>Do:</b> {r.action}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <b>Avoid:</b> {r.mistakeToAvoid}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);
}