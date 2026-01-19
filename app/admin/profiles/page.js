"use client";

import { useEffect, useState } from "react";

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/api/profiles/approved?pending=true")
      .then((r) => r.json())
      .then(setProfiles);
  }, []);

  const approve = async (id) => {
    await fetch("/api/profiles/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setProfiles((p) => p.filter((x) => x._id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pending Profiles</h1>

      {profiles.map((p) => (
        <div key={p._id} className="border p-4 rounded">
          <p className="font-semibold">{p.name}</p>
          <p className="text-sm">{p.profileUrl}</p>
          <p className="text-sm mt-1">{p.description}</p>

          <button
            onClick={() => approve(p._id)}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
