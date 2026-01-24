"use client";
import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "Students aren’t just thinking, ‘What do I need to pass this exam?’ They’re building habits and behaviours that equip them to thrive in any school, university, or workplace.",
    name: "Lathi",
    role: "AI Career Mentor",
    bg: "/person1.jpeg",
  },
  {
    quote:
      "This platform transformed my GitHub and LinkedIn presence. Recruiters finally noticed my work and not just my degree.",
    name: "Neha Sharma",
    role: "Software Engineer",
    bg: "/person2.jpeg",
  },
  {
    quote:
      "The resume analysis pointed out things I never realised were holding me back. The improvement in responses was instant.",
   name: "Ravi Kumar",
    role: "UX Designer",
    bg: "/person3.jpeg",
  },
];

const Testimonial = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused]);

  const { quote, name, role, bg } = testimonials[index];

  return (
    <section className="relative min-h-[100vh] flex items-center px-6 md:px-16 overflow-hidden">
      {/* Flipped Background */}
      <div
        className="absolute inset-0 scale-x-[-1]"
        style={{
          backgroundImage: `url('${bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-3xl text-white transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="italic mb-6 text-lg">In Their Words…</p>

        <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-10">
          “{quote}”
        </blockquote>

        <div>
          <p className="font-medium text-lg">{name}</p>
          <p className="text-sm uppercase tracking-wide opacity-80">{role}</p>
        </div>

        <div className="flex items-center gap-4 mt-10">
          
          {/* Pause / Resume */}
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-sm underline opacity-80 hover:opacity-100"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
