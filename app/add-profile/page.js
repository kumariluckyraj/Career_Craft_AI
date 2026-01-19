"use client";

import { useState } from "react";

export default function AddProfilePage() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!linkedinUrl) {
      setMsg("Please enter a LinkedIn URL");
      return;
    }

    const res = await fetch("/api/profiles/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedinUrl, description }), // <== here
    });

    const data = await res.json();
    console.log("Submit response:", data);

    if (res.ok) {
      setMsg("Submitted for approval 🚀");
      setLinkedinUrl("");
      setDescription("");
    } else {
      setMsg(data.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Submit LinkedIn Profile</h1>

      <input
        className="border p-2 w-full"
        placeholder="LinkedIn profile URL"
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Why should others follow this profile?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
    </div>
  );
}
