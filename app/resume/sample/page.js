"use client";
import { useRouter } from "next/navigation";
export default function SampleResumeComingSoon() {
    const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-neutral-50 to-stone-100 px-6">
      
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 max-w-xl text-center border border-neutral-200">
        
        {/* Heading */}
        <h1 className="text-4xl font-serif font-semibold text-neutral-900 mb-4">
          Sample Resume
        </h1>

        {/* Subtext */}
        <p className="text-neutral-600 mb-6">
          We are crafting beautiful, professional and AI-powered sample resumes 
          to help you stand out. This feature will be available soon.
        </p>

        {/* Elegant divider */}
        <div className="h-px bg-neutral-200 my-6"></div>

        {/* Coming soon badge */}
        <span className="inline-block bg-amber-100 text-amber-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🚀 Coming Soon
        </span>

        {/* Optional CTA */}
        <div>
          <div>
  <button
    onClick={() => router.back()}
    className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition"
  >
    ← Back
  </button>
</div>
        </div>

      </div>
    </div>
  );
}