export default function ResumePreview({ data }) {
  if (!data) return <p>No preview available</p>;

  const links = data.links || {
    github: data.github,
    linkedin: data.linkedin,
    portfolio: data.portfolio,
    email: data.email,
    phone: data.phone,
  };

  return (
    <div
      style={{
        padding: "40px",
        background: "#fff",
        borderRadius: "14px",
        fontFamily: "serif",
        color: "#2d2d2d",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        lineHeight: "1.7",
      }}
    >
      {/* NAME */}
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "10px",
          borderBottom: "2px solid #e8dfd2",
          paddingBottom: "10px",
        }}
      >
        {data.name}
      </h1>

      {/* CONTACT */}
      <div
        style={{
          background: "#fdf8f2",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <p>
          <b>GitHub:</b> {links.github} <br />
          <b>LinkedIn:</b> {links.linkedin} <br />
          <b>Portfolio:</b> {links.portfolio} <br />
          <b>Email:</b> {links.email} <br />
          <b>Phone:</b> {links.phone}
        </p>
      </div>

      {/* SUMMARY */}
      <Section title="Summary">
        <p>{data.summary}</p>
      </Section>

      {/* SKILLS */}
      <Section title="Technical Skills">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(Array.isArray(data.technicalSkills)
            ? data.technicalSkills
            : (data.technicalSkills || "").split(",")
          ).map((skill, i) => (
            <span
              key={i}
              style={{
                background: "#ece2d6",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section title="Projects">
        {data.projects?.map((p, i) => (
          <div key={i} style={card}>
            <p style={{ fontWeight: "600" }}>
              {p.name} <span style={{ color: "#777" }}>({p.duration})</span>
            </p>
            <p>{p.description}</p>
            <p>
              <b>Tech:</b>{" "}
              {Array.isArray(p.techStack)
                ? p.techStack.join(", ")
                : p.techStack}
            </p>
          </div>
        ))}
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience">
        {data.experience?.map((e, i) => (
          <div key={i} style={card}>
            <p style={{ fontWeight: "600" }}>
              {e.role} – {e.company}{" "}
              <span style={{ color: "#777" }}>({e.duration})</span>
            </p>
            <p>{e.description}</p>
          </div>
        ))}
      </Section>

      {/* EDUCATION */}
      <Section title="Education">
        {data.education?.map((edu, i) => (
          <div key={i} style={card}>
            <p style={{ fontWeight: "600" }}>
              {edu.institute}{" "}
              <span style={{ color: "#777" }}>({edu.duration})</span>
            </p>
            {edu.cgpa && (
              <p>
                <b>CGPA:</b> {edu.cgpa}
              </p>
            )}
          </div>
        ))}
      </Section>
    </div>
  );
}

/* reusable section */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <h3
        style={{
          borderBottom: "1px solid #e8dfd2",
          paddingBottom: "6px",
          marginBottom: "12px",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* cards */
const card = {
  background: "#faf7f2",
  padding: "12px 15px",
  borderRadius: "8px",
  marginBottom: "10px",
};