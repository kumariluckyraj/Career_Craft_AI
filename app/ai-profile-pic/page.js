"use client";

import { useState } from "react";

export default function AIProfilePicPage() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    if (!file) return setError("Please upload a photo first");

    setLoading(true);
    setError("");
    setResultUrl("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/ai/profile-pic", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate image");

      setResultUrl(data.url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">AI Professional Headshot Generator</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Processing…" : "Generate Professional Pic"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {resultUrl && (
        <div>
          <h2 className="mt-4 font-semibold">Your Professional Headshot</h2>
          <img
            src={resultUrl}
            alt="Professional Pic"
            className="w-48 h-48 rounded-full mt-2"
          />
        </div>
      )}
    </div>
  );
}
