"use client";

import { useEffect, useState } from "react";

export default function LinkedInAIPage() {

  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [postIdeas, setPostIdeas] = useState(null);
  const [pitch, setPitch] = useState("");
  const [networking, setNetworking] = useState(null);

  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingPostIdeas, setLoadingPostIdeas] = useState(false);
  const [loadingPitch, setLoadingPitch] = useState(false);

  const [showPostIdeaReminder, setShowPostIdeaReminder] = useState(false);


  const profile = {
    techStack,
    role: "student",
    goal: "internship and learning",
  };


  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const res = await fetch("/api/user/tech", { credentials: "include" });
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


  const fetchPostIdeaReminder = async () => {
    try {
      const res = await fetch("/api/strategy/reminder");
      if (!res.ok) return;
      const data = await res.json();
      setShowPostIdeaReminder(data.showReminder);
    } catch (err) {
      console.error("Failed to fetch reminder:", err);
    }
  };

  useEffect(() => {
    fetchPostIdeaReminder();
    const interval = setInterval(fetchPostIdeaReminder, 60 * 1000);
    return () => clearInterval(interval);
  }, []);


  const callAI = async (endpoint, body, setter, setLoadingState) => {
    if (setLoadingState) setLoadingState(true);

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

      const data = await res.text(); 
      setter(data);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Request failed");
    } finally {
      if (setLoadingState) setLoadingState(false);
    }
  };


 return (
  <div className="min-h-screen bg-[#f3f2ef] pt-[100px] p-6">
    <div className="max-w-4xl mx-auto space-y-10">

      {/* ===== HEADER ===== */}
      <header className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0a66c2]">
          LinkedIn AI Mentor
          <span className="text-gray-500 text-lg md:text-xl"> (Students)</span>
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Discover your growth opportunities on LinkedIn: analyze your profile,
          generate content ideas, and craft the perfect DM pitch.
        </p>
      </header>

      {/* ================= TECH STACK ================= */}
      <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Tech Stack</h2>

       <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <input
    value={techInput}
    onChange={(e) => setTechInput(e.target.value)}
    placeholder="Add tech (React, Python...)"
    className="flex-1 border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-md sm:rounded-lg focus:ring-2 focus:ring-[#0a66c2] outline-none transition"
  />

  <button
    onClick={addTech}
    className="bg-[#0a66c2] hover:bg-[#004182] text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-md sm:rounded-lg font-semibold transition w-full sm:w-auto"
  >
    Add
  </button>
</div>

        <div className="flex flex-wrap gap-3 mt-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="bg-[#e7f3ff] text-[#0a66c2] px-4 py-2 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
              onClick={() => removeTech(tech)}
            >
              {tech} ✕
            </span>
          ))}
        </div>
      </section>

      {/* ================= ANALYZE ================= */}
      <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">Analyze Profile</h2>

        <button
          onClick={() =>
            callAI(
              "/api/ai/student/analyze",
              { profile },
              setAnalysis,
              setLoadingAnalysis
            )
          }
          className="bg-[#057642] hover:bg-[#046c3c] text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loadingAnalysis ? "Analyzing..." : "Analyze Profile"}
        </button>

        {analysis && (
          <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
            {analysis}
          </pre>
        )}
      </section>

      {/* ================= POST IDEAS ================= */}
      <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">Post Ideas</h2>

        {showPostIdeaReminder && (
          <div className="rounded-md bg-[#fff4e5] border-l-4 border-[#ffb900] p-4 text-[#915907]">
            ⚠️ You haven’t generated post ideas recently. Stay consistent to grow
            on LinkedIn.
          </div>
        )}

        <button
          onClick={async () => {
            await callAI(
              "/api/ai/student/post-ideas",
              { profile },
              setPostIdeas,
              setLoadingPostIdeas
            );
            setShowPostIdeaReminder(false);
          }}
          className="bg-[#0a66c2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loadingPostIdeas ? "Generating..." : "Generate Post Ideas"}
        </button>

        {postIdeas && (
          <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
            {postIdeas}
          </pre>
        )}
      </section>

      {/* ================= DM PITCH ================= */}
      <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 space-y-3">
        <h2 className="text-2xl font-semibold text-gray-800">DM Pitch</h2>

        <button
          onClick={async () => {
            setLoadingPitch(true);
            try {
              const res = await fetch("/api/ai/student/pitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profile }),
              });
              const data = await res.json();
              setPitch(data.pitch);
            } catch (err) {
              console.error("Failed to generate pitch:", err);
              setPitch("Error generating pitch.");
            } finally {
              setLoadingPitch(false);
            }
          }}
          className="bg-[#6f42c1] hover:bg-[#59359c] text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loadingPitch ? "Generating..." : "Generate DM Pitch"}
        </button>

        {pitch && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-line">
            {pitch}
          </div>
        )}
      </section>
    </div>
  </div>
);
}