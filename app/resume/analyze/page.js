"use client";

import { useState } from "react";

const PROMPTS = {
  HR_REVIEW: `You are an experienced Technical Human Resource Manager.
Format in bullet points with headings:
Overall Alignment
Strengths
Weaknesses
Recommendation
Do NOT explain the process.`,

  SKILL_IMPROVEMENT: `You are a career development coach.
Provide actionable bullet points under:
Technical Skills
Soft Skills
Certifications
Tools
Do NOT add introductions.`,

  ATS_MATCH: `You are a professional ATS scanner.
Output STRICTLY in this format:
Percentage Match: XX%
Missing Keywords:
- keyword1
- keyword2
Final Thoughts:
Do NOT add anything else.`,
};

export default function ResumePage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsPercent, setAtsPercent] = useState(null);

  // Convert PDF to Base64
  const pdfToBase64 = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return base64;
  };

 const handleUpload = async (actionType) => {
  if (!file) return alert("⚠️ Please upload a resume first");

  setLoading(true);
  setResult("");
  setAtsPercent(null);

  const pdfBase64 = await pdfToBase64(file);

  try {
    const res = await fetch("/api/upload-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdfBase64,
        fileName: file.name,
        jobDesc,
        actionType,
        actionPrompt: PROMPTS[actionType],
      }),
    });

    const data = await res.json();
    setResult(data.aiResult || "No AI response");

    // ATS %
    if (actionType === "ATS_MATCH" && data.aiResult) {
      const match = data.aiResult.match(/(\d+)%/);
      if (match) setAtsPercent(Number(match[1]));
    }
  } catch (err) {
    console.error(err);
    setResult("⚠️ Failed to process resume");
  }

  setLoading(false);
};

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-4">📄 ATS Resume Expert</h1>

      {/* Job description & resume upload */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">📝 Job Description</h2>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-64 p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">📂 Upload Resume</h2>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
          {file && <p className="mt-2 text-green-400">✅ {file.name} uploaded</p>}
        </div>
      </div>

      {/* Action buttons */}
      <h2 className="text-xl font-semibold mt-4 mb-2">🔘 Choose an Action</h2>
      <div className="flex gap-4">
       <button onClick={() => handleUpload("HR_REVIEW")}>
  📝 Tell Me About the Resume
</button>

<button onClick={() => handleUpload("SKILL_IMPROVEMENT")}>
  💡 How Can I Improve my Skills
</button>

<button onClick={() => handleUpload("ATS_MATCH")}>
  📊 Percentage Match
</button>

      </div>

      {loading && <p className="mt-4 text-yellow-400">Processing...</p>}

      {/* Display AI result */}
      {result && (
        <div className="mt-4 p-4 rounded bg-gray-800 border border-gray-700">
          <h2 className="font-semibold mb-2">AI Result:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}

      {/* ATS % progress bar */}
      {atsPercent !== null && (
        <div className="mt-4">
          <p className="font-semibold">ATS Match: {atsPercent}%</p>
          <div className="w-full bg-gray-700 rounded h-4">
            <div
              className="bg-teal-400 h-4 rounded"
              style={{ width: `${atsPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
