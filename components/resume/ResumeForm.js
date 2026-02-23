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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProjectChange = (i, key, val) => {
    const updated = [...formData.projects];
    updated[i][key] = val;
    setFormData({ ...formData, projects: updated });
  };

  const handleExperienceChange = (i, key, val) => {
    const updated = [...formData.experience];
    updated[i][key] = val;
    setFormData({ ...formData, experience: updated });
  };

  const handleEducationChange = (i, key, val) => {
    const updated = [...formData.education];
    updated[i][key] = val;
    setFormData({ ...formData, education: updated });
  };

  const addProject = () =>
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", description: "", techStack: "", duration: "" }],
    });

  const addExperience = () =>
    setFormData({
      ...formData,
      experience: [...formData.experience, { role: "", company: "", duration: "", description: "" }],
    });

  const addEducation = () =>
    setFormData({
      ...formData,
      education: [...formData.education, { institute: "", duration: "", cgpa: "" }],
    });

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
        technicalSkills: formData.technicalSkills.split(",").map(s => s.trim()).filter(Boolean),
        projects: formData.projects.map(p => ({
          ...p,
          techStack: p.techStack.split(",").map(t => t.trim()).filter(Boolean),
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
      if (!data.success) return alert("AI failed");

      setEnhancedData(data.enhanced);
    } catch (e) {
      alert("Error!");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!enhancedData) return alert("Enhance first!");

    const element = document.getElementById("resume-preview");
    const canvas = await html2canvas(element, { scale: 2 });

    const pdf = new jsPDF("p", "mm", "a4");
    const img = canvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "30px",
        padding: "30px",
        background: "linear-gradient(135deg,#fdf6ec,#f8f4f0)",
        minHeight: "100vh",
      }}
    >
      {/* LEFT FORM */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#2d2d2d" }}>Enter Details</h2>

        {[
          ["name", "Full Name"],
          ["github", "GitHub"],
          ["linkedin", "LinkedIn"],
          ["portfolio", "Portfolio"],
          ["email", "Email"],
          ["phone", "Phone"],
        ].map(([field, label]) => (
          <input
            key={field}
            name={field}
            placeholder={label}
            value={formData[field]}
            onChange={handleChange}
            style={inputStyle}
          />
        ))}

        <h3>Summary</h3>
        <textarea name="summary" value={formData.summary} onChange={handleChange} style={textareaStyle} />

        <h3>Technical Skills</h3>
        <textarea name="technicalSkills" value={formData.technicalSkills} onChange={handleChange} style={textareaStyle} />

        <h3>Projects</h3>
        {formData.projects.map((p, i) => (
          <div key={i} style={card}>
            <input value={p.name} onChange={(e) => handleProjectChange(i, "name", e.target.value)} placeholder="Project Name" style={inputStyle} />
            <textarea value={p.description} onChange={(e) => handleProjectChange(i, "description", e.target.value)} placeholder="Description" style={textareaStyle} />
            <input value={p.techStack} onChange={(e) => handleProjectChange(i, "techStack", e.target.value)} placeholder="Tech Stack" style={inputStyle} />
            <input value={p.duration} onChange={(e) => handleProjectChange(i, "duration", e.target.value)} placeholder="Duration" style={inputStyle} />
          </div>
        ))}
        <button style={btn} onClick={addProject}>+ Add Project</button>

        <h3>Experience</h3>
        {formData.experience.map((exp, i) => (
          <div key={i} style={card}>
            <input value={exp.role} onChange={(e) => handleExperienceChange(i, "role", e.target.value)} placeholder="Role" style={inputStyle} />
            <input value={exp.company} onChange={(e) => handleExperienceChange(i, "company", e.target.value)} placeholder="Company" style={inputStyle} />
            <input value={exp.duration} onChange={(e) => handleExperienceChange(i, "duration", e.target.value)} placeholder="Duration" style={inputStyle} />
            <textarea value={exp.description} onChange={(e) => handleExperienceChange(i, "description", e.target.value)} placeholder="Description" style={textareaStyle} />
          </div>
        ))}
        <button style={btn} onClick={addExperience}>+ Add Experience</button>

        <h3>Education</h3>
        {formData.education.map((edu, i) => (
          <div key={i} style={card}>
            <input value={edu.institute} onChange={(e) => handleEducationChange(i, "institute", e.target.value)} placeholder="Institute" style={inputStyle} />
            <input value={edu.duration} onChange={(e) => handleEducationChange(i, "duration", e.target.value)} placeholder="Duration" style={inputStyle} />
            <input value={edu.cgpa} onChange={(e) => handleEducationChange(i, "cgpa", e.target.value)} placeholder="CGPA" style={inputStyle} />
          </div>
        ))}
        <button style={btn} onClick={addEducation}>+ Add Education</button>

        <br /><br />

        <button style={mainBtn} onClick={enhanceResume}>
          {loading ? "Enhancing..." : "✨ Enhance With AI"}
        </button>

        <button style={mainBtn} onClick={downloadPDF}>
          📄 Download
        </button>
      </div>

      {/* PREVIEW */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div id="resume-preview">
          <ResumePreview data={enhancedData || formData} />
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "8px",
  border: "1px solid #e0d6c8",
  background: "#faf7f2",
};

const textareaStyle = { ...inputStyle, minHeight: "90px" };

const card = {
  background: "#fdf8f2",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "15px",
};

const btn = {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#ece2d6",
  cursor: "pointer",
  marginBottom: "15px",
};

const mainBtn = {
  padding: "12px 20px",
  borderRadius: "10px",
  border: "none",
  background: "#2d2d2d",
  color: "#fff",
  marginRight: "10px",
  cursor: "pointer",
};