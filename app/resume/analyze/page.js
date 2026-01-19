"use client";

import { useState } from "react";

export default function ATSResumeExpert() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [response1, setResponse1] = useState("");
  const [response2, setResponse2] = useState("");
  const [response3, setResponse3] = useState("");
  const [atsPercent, setAtsPercent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF file.");
      setResumeFile(null);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please upload a resume first.");
      return null;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    // You can have an API endpoint to upload PDF and return base64
    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.base64; // base64 of first page (like your Python code)
  };

  const callAI = async (prompt, setter) => {
    if (!resumeFile) {
      alert("Please upload a resume first.");
      return;
    }

    setLoading(true);
    try {
      const resumeBase64 = await uploadResume();

      const res = await fetch("/api/ai/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          jobDescription: jobDesc,
          resumeBase64,
        }),
      });

      const data = await res.json();
      setter(data.response);

      // For ATS percentage extraction
      if (prompt.includes("Percentage Match")) {
        const match = data.response.match(/(\d+)%/);
        if (match) setAtsPercent(Number(match[1]));
      }
    } catch (err) {
      console.error(err);
      alert("Error calling AI.");
    } finally {
      setLoading(false);
    }
  };

  const prompts = {
    eval: `You are an experienced Technical Human Resource Manager...
Format in bullet points with headings: Overall Alignment, Strengths, Weaknesses, Recommendation.`,
    skills: `You are a career development coach...
Format as actionable bullet points: Technical Skills, Soft Skills, Certifications, Tools.`,
    ats: `You are a skilled ATS scanner...
Format clearly: Percentage Match, Missing Keywords, Final Thoughts.`,
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white font-sans">
      <div className="bg-gradient-to-r from-cyan-400 to-pink-500 p-6 rounded-xl mb-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold">📄 ATS Resume Expert</h1>
        <p className="text-lg mt-2">Evaluate your resume like a recruiter & ATS would</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <label className="block mb-2 font-semibold">📝 Job Description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white h-60"
            placeholder="Paste the job description here..."
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">📂 Upload Resume</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {resumeFile && <p className="mt-2 text-green-400">✅ {resumeFile.name} uploaded</p>}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className="btn-gradient"
          onClick={() => callAI(prompts.eval, setResponse1)}
        >
          📝 Tell Me About the Resume
        </button>
        <button
          className="btn-gradient"
          onClick={() => callAI(prompts.skills, setResponse2)}
        >
          💡 How Can I Improve my Skills
        </button>
        <button
          className="btn-gradient"
          onClick={() => callAI(prompts.ats, setResponse3)}
        >
          📊 Percentage Match
        </button>
      </div>

      {loading && <p className="text-yellow-400 mb-4">Thinking...</p>}

      {response1 && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold text-cyan-400 mb-2">🔍 HR Evaluation Results</h2>
          <pre>{response1}</pre>
        </div>
      )}
      {response2 && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold text-pink-400 mb-2">💡 Skill Improvement Suggestions</h2>
          <pre>{response2}</pre>
        </div>
      )}
      {response3 && (
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold text-teal-400 mb-2">📊 ATS Evaluation Details</h2>
          <pre>{response3}</pre>
          {atsPercent !== null && (
            <div className="mt-2">
              <p>ATS Match: {atsPercent}%</p>
              <progress value={atsPercent} max={100} className="w-full" />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .btn-gradient {
          background: linear-gradient(90deg, #00f0ff, #ff00f0);
          padding: 12px 25px;
          font-weight: bold;
          border-radius: 12px;
          box-shadow: 0 0 10px #00f0ff, 0 0 20px #ff00f0;
          transition: all 0.3s ease;
          color: white;
        }
        .btn-gradient:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #00f0ff, 0 0 30px #ff00f0;
        }
      `}</style>
    </div>
  );
}
