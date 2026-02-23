import React from "react";

const About = () => {
  return (
    <div className="flex items-center justify-center py-16 bg-gray-50">

      <div className="text-center max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-">
          Streamline your career growth with AI-powered tools
        </h1>
        <p className="text-lg md:text-xl text-gray-800 mb-4">
          Generate GitHub READMEs and repositories effortlessly. Craft compelling LinkedIn bios and descriptions.
        </p>
        <p className="text-lg md:text-xl text-gray-800 mb-4">
          Post and analyze LinkedIn URLs. Get your resume analyzed — all in one place.
        </p>
        <p className="text-lg md:text-xl text-gray-800 mb-8">
          Built for students, professionals, and job seekers, our platform helps you present your best self online and maximize opportunities.
        </p>
        
      </div>
    </div>
  );
};

export default About;
