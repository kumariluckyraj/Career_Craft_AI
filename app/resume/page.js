"use client";

import Link from "next/link";

export default function ResumeHubPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">📄 Resume Hub</h1>

      {/* Buttons */}
      <div className="flex gap-6 mb-10">
        <Link href="/resume/build">
          <button className="btn-action">🛠 Build Resume</button>
        </Link>

        <Link href="/resume/analyze">
          <button className="btn-action">🔍 Analyze Resume</button>
        </Link>

        <Link href="/resume/sample">
          <button className="btn-action">📄 Sample Resume</button>
        </Link>
      </div>

      <p className="text-gray-400">
        Click a button to go to the respective page.
      </p>

      <style jsx>{`
        .btn-action {
          background: linear-gradient(90deg, #00f0ff, #ff00f0);
          padding: 12px 25px;
          border-radius: 12px;
          font-weight: bold;
          box-shadow: 0 0 10px #00f0ff, 0 0 20px #ff00f0;
          transition: all 0.3s ease;
          cursor: pointer;
          color: white;
        }
        .btn-action:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px #00f0ff, 0 0 30px #ff00f0;
        }
      `}</style>
    </div>
  );
}
