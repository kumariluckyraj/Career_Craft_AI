"use client";

import { useState } from "react";
import ResumePreview from "./ResumePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    github: "",
    linkedin: "",
    portfolio: "",
    email: "",
    phone: "",
    summary: "",
    technicalSkills: "",
    projects: [{ name: "", description: "", techStack: "", duration: "" }],
    experience: [{ role: "", company: "", duration: "", description: "" }],
    education: [{ institute: "", duration: "", cgpa: "" }],
  });

  const [enhancedData, setEnhancedData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Basic input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Projects handler
  const handleProjectChange = (index, key, value) => {
    const updated = [...formData.projects];
    updated[index][key] = value;
    setFormData({ ...formData, projects: updated });
  };

  const handleExperienceChange = (index, key, value) => {
  const updated = [...formData.experience];
  updated[index][key] = value;
  setFormData({ ...formData, experience: updated });
};

const addExperience = () => {
  setFormData({
    ...formData,
    experience: [
      ...formData.experience,
      { role: "", company: "", duration: "", description: "" },
    ],
  });
};

const handleEducationChange = (index, key, value) => {
  const updated = [...formData.education];
  updated[index][key] = value;
  setFormData({ ...formData, education: updated });
};

const addEducation = () => {
  setFormData({
    ...formData,
    education: [...formData.education, { institute: "", duration: "", cgpa: "" }],
  });
};

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { name: "", description: "", techStack: "", duration: "" },
      ],
    });
  };

  // AI Enhance
  const enhanceResume = async () => {
    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        links: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
          email: formData.email,
          phone: formData.phone,
        },
        summary: formData.summary,
        technicalSkills: formData.technicalSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        projects: formData.projects.map((p) => ({
          name: p.name,
          description: p.description,
          techStack: p.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          duration: p.duration,
        })),
        experience: formData.experience,
        education: formData.education,
      };

      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        alert("AI failed: " + data.error);
        return;
      }

      setEnhancedData(data.enhanced);
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const downloadPDF = async () => {
  if (!enhancedData) {
    alert("Please enhance resume first!");
    return;
  }

  const element = document.getElementById("resume-preview");
  if (!element) return alert("Resume preview not found!");

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("enhanced_resume.pdf");
};


  return (
    <div style={{ display: "flex", gap: "30px" }}>
      {/* LEFT SIDE FORM */}
      <div style={{ flex: 1 }}>
        <h2>Enter Details</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          name="github"
          placeholder="GitHub Link"
          value={formData.github}
          onChange={handleChange}
        />

        <input
          name="linkedin"
          placeholder="LinkedIn Link"
          value={formData.linkedin}
          onChange={handleChange}
        />

        <input
          name="portfolio"
          placeholder="Portfolio Link"
          value={formData.portfolio}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <h3>Summary</h3>
        <textarea
          name="summary"
          placeholder="Write short summary..."
          value={formData.summary}
          onChange={handleChange}
        />

        <h3>Technical Skills</h3>
        <textarea
          name="technicalSkills"
          placeholder="Example: JavaScript, Next.js, Node.js"
          value={formData.technicalSkills}
          onChange={handleChange}
        />

        <h3>Projects</h3>
        {formData.projects.map((p, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              placeholder="Project Name"
              value={p.name}
              onChange={(e) =>
                handleProjectChange(i, "name", e.target.value)
              }
            />
            <textarea
              placeholder="What it does"
              value={p.description}
              onChange={(e) =>
                handleProjectChange(i, "description", e.target.value)
              }
            />
            <input
              placeholder="Tech Stack (comma separated)"
              value={p.techStack}
              onChange={(e) =>
                handleProjectChange(i, "techStack", e.target.value)
              }
            />
            <input
              placeholder="Duration (eg: Jan 2024 - Feb 2024)"
              value={p.duration}
              onChange={(e) =>
                handleProjectChange(i, "duration", e.target.value)
              }
            />

            <h3>Experience</h3>
{formData.experience.map((exp, i) => (
  <div
    key={i}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
    }}
  >
    <input
      placeholder="Role (eg: Frontend Intern)"
      value={exp.role}
      onChange={(e) => handleExperienceChange(i, "role", e.target.value)}
    />

    <input
      placeholder="Company Name"
      value={exp.company}
      onChange={(e) => handleExperienceChange(i, "company", e.target.value)}
    />

    <input
      placeholder="Duration (eg: Jun 2024 - Aug 2024)"
      value={exp.duration}
      onChange={(e) => handleExperienceChange(i, "duration", e.target.value)}
    />

    <textarea
      placeholder="Work description / achievements"
      value={exp.description}
      onChange={(e) =>
        handleExperienceChange(i, "description", e.target.value)
      }
    />
  </div>
))}

<button onClick={addExperience}>+ Add Experience</button>


<h3>Education</h3>
{formData.education.map((edu, i) => (
  <div
    key={i}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
    }}
  >
    <input
      placeholder="Institute Name (School / College)"
      value={edu.institute}
      onChange={(e) => handleEducationChange(i, "institute", e.target.value)}
    />

    <input
      placeholder="Duration (eg: 2022 - 2026)"
      value={edu.duration}
      onChange={(e) => handleEducationChange(i, "duration", e.target.value)}
    />

    <input
      placeholder="CGPA / Percentage (optional)"
      value={edu.cgpa}
      onChange={(e) => handleEducationChange(i, "cgpa", e.target.value)}
    />
  </div>
))}

<button onClick={addEducation}>+ Add Education</button>

          </div>
        ))}

        <button onClick={addProject}>+ Add Project</button>

        <br />
        <br />

        <button onClick={enhanceResume} disabled={loading}>
          {loading ? "Enhancing..." : "✨ Enhance with AI"}
        </button>
      </div>

<button
  onClick={downloadPDF}
  disabled={!enhancedData}
  style={{ marginLeft: "10px" }}
>
  📄 Download Enhanced PDF
</button>


      {/* RIGHT SIDE PREVIEW */}
     {/* RIGHT SIDE PREVIEW */}
<div style={{ flex: 1 }}>
  <h2>Preview</h2>

  {/* 👇 This wrapper will be converted into PDF */}
  <div id="resume-preview">
    <ResumePreview data={enhancedData || formData} />

  </div>
</div>

    </div>
  );
}
