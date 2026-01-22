export default function ResumePreview({ data }) {
  if (!data) return <p>No preview available</p>;

  // ✅ support both enhancedData format (data.links) and formData format (data.github)
  const links = data.links || {
    github: data.github,
    linkedin: data.linkedin,
    portfolio: data.portfolio,
    email: data.email,
    phone: data.phone,
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd" }}>
      <h1>{data.name}</h1>

      <p>
        <b>GitHub:</b> {links.github} <br />
        <b>LinkedIn:</b> {links.linkedin} <br />
        <b>Portfolio:</b> {links.portfolio} <br />
        <b>Email:</b> {links.email} <br />
        <b>Phone:</b> {links.phone}
      </p>

      <h3>Summary</h3>
      <p>{data.summary}</p>

      <h3>Technical Skills</h3>
      <p>
        {Array.isArray(data.technicalSkills)
          ? data.technicalSkills.join(", ")
          : data.technicalSkills}
      </p>

      <h3>Projects</h3>
      {data.projects?.map((p, i) => (
        <div key={i}>
          <p>
            <b>{p.name}</b> ({p.duration})
          </p>
          <p>{p.description}</p>
          <p>
            <b>Tech:</b>{" "}
            {Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack}
          </p>
        </div>
      ))}

      <h3>Experience</h3>
      {data.experience?.map((e, i) => (
        <div key={i}>
          <p>
            <b>{e.role}</b> - {e.company} ({e.duration})
          </p>
          <p>{e.description}</p>
        </div>
      ))}

      <h3>Education</h3>
      {data.education?.map((edu, i) => (
        <div key={i}>
          <p>
            <b>{edu.institute}</b> ({edu.duration})
          </p>
          {edu.cgpa && (
            <p>
              <b>CGPA:</b> {edu.cgpa}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
