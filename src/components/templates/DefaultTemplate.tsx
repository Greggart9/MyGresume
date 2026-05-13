import { ResumeData } from "@/types";

function fmt(d: string): string {
  if (!d) return "";
  if (/present/i.test(d)) return "Present";

  // YYYY-MM format → "Jan 2024"
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-");
    return new Date(+y, +m - 1).toLocaleDateString("en-US", {
      month: "short", year: "numeric",
    });
  }

  // YYYY-MM-DD format → strip day, show "Jan 2024"
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-");
    return new Date(+y, +m - 1).toLocaleDateString("en-US", {
      month: "short", year: "numeric",
    });
  }

  // Just a year "2024"
  if (/^\d{4}$/.test(d)) return d;

  return d;
}

export default function DefaultTemplate({ resume }: { resume: ResumeData }) {
  const {
    personalInfo, summary, experience,
    education, skills, certifications, projects,
  } = resume;

  // Group skills by category
  const skillGroups: Record<string, string[]> = {};
  (skills || []).filter(s => s.name?.trim()).forEach(s => {
    const cat = s.category || "Technical";
    if (!skillGroups[cat]) skillGroups[cat] = [];
    skillGroups[cat].push(s.name.trim());
  });

  const hasExperience = Array.isArray(experience) &&
    experience.filter(e => e.company || e.role).length > 0;
  const hasEducation = Array.isArray(education) &&
    education.filter(e => e.institution || e.degree).length > 0;
  const hasCertifications = Array.isArray(certifications) &&
    certifications.filter(c => c.name?.trim().length > 2).length > 0;
  const hasSkills = Object.keys(skillGroups).length > 0;
  const hasProjects = Array.isArray(projects) &&
    projects.filter(p => p.name?.trim()).length > 0;
  const hasSummary = summary?.trim().length > 0;

  // Contact links
  const contactLinks = [
    personalInfo?.website ? "Portfolio" : null,
    personalInfo?.email || null,
    personalInfo?.linkedin ? "LinkedIn" : null,
  ].filter(Boolean).join(" · ");

  const wrap: React.CSSProperties = {
    fontFamily: "Times New Roman, Times, serif",
    fontSize: "10.5pt",
    color: "#000",
    lineHeight: "1.45",
    background: "#fff",
    padding: "36px 48px",
    minHeight: "297mm",
    width: "100%",
    boxSizing: "border-box",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "10.5pt",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid #000",
    paddingBottom: "2px",
    marginBottom: "7px",
    marginTop: "14px",
  };

  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  };

  const dateStyle: React.CSSProperties = {
    fontSize: "10pt",
    color: "#333",
    whiteSpace: "nowrap",
    marginLeft: "12px",
    flexShrink: 0,
  };

  return (
    <div style={wrap}>

      {/* ── HEADER ── */}
      {/* ── HEADER ── */}
<div style={{
  borderBottom: "1.5px solid #000",
  paddingBottom: "8px",
  marginBottom: "12px",
}}>
  {personalInfo?.fullName && (
    <h1 style={{
      fontSize: "16pt",
      fontWeight: "700",
      margin: "0 0 2px 0",
      fontFamily: "Times New Roman, serif",
    }}>
      {personalInfo.fullName}
    </h1>
  )}
  {personalInfo?.jobTitle && (
    <p style={{ margin: "0 0 4px 0", fontSize: "10.5pt", fontWeight: "400" }}>
      {personalInfo.jobTitle}
    </p>
  )}
  {/* Contact all on one line below name */}
  <p style={{ fontSize: "9.5pt", color: "#333", margin: 0 }}>
    {[
      personalInfo?.email,
      personalInfo?.phone,
      personalInfo?.location,
      personalInfo?.linkedin,
      personalInfo?.website,
    ].filter(Boolean).join(" · ")}
  </p>
</div>

      {/* ── SUMMARY ── */}
      {hasSummary && (
        <div>
          <h2 style={sectionTitle}>Professional Summary</h2>
          <p style={{ margin: 0, lineHeight: "1.5" }}>{summary}</p>
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {hasExperience && (
        <div>
          <h2 style={sectionTitle}>Experience</h2>
          {experience.filter(e => e.company || e.role).map((exp, i) => (
            <div key={exp.id || i} style={{ marginBottom: "11px" }}>
              <div style={row}>
                <span style={{ fontWeight: "700" }}>
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ""}
                </span>
                <span style={dateStyle}>
                  {fmt(exp.startDate)}
                  {(exp.startDate || exp.endDate || exp.current) ? " – " : ""}
                  {exp.current ? "Present" : fmt(exp.endDate)}
                </span>
              </div>

              {exp.role && (
                <p style={{ margin: "1px 0 3px", fontStyle: "italic", fontSize: "10.5pt" }}>
                  {exp.role}
                </p>
              )}

              {Array.isArray(exp.bullets) &&
                exp.bullets.filter(Boolean).length > 0 && (
                  <ul style={{
                    margin: "3px 0 0",
                    paddingLeft: "18px",
                    listStyleType: "disc",
                  }}>
                    {exp.bullets.filter(Boolean).map((b, j) => (
                      <li key={j} style={{ marginBottom: "1px", lineHeight: "1.45" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </div>
      )}

      {/* ── EDUCATION ── */}
      {hasEducation && (
        <div>
          <h2 style={sectionTitle}>Education</h2>
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={edu.id || i} style={{ marginBottom: "7px" }}>
              <div style={row}>
                <span>
                  <span style={{ fontWeight: "700" }}>{edu.institution}</span>
                  {edu.institution && (edu.degree || edu.field) ? ", " : ""}
                  {[edu.degree, edu.field].filter(Boolean).join(", ")}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </span>
                <span style={dateStyle}>
                  {fmt(edu.startDate)}
                  {(edu.startDate || edu.endDate) ? " – " : ""}
                  {fmt(edu.endDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CERTIFICATIONS ── */}
      {hasCertifications && (
        <div>
          <h2 style={sectionTitle}>Certifications</h2>
          {certifications
            .filter(c => c.name?.trim().length > 2)
            .map((c, i) => (
              <div key={c.id || i} style={{ ...row, marginBottom: "4px" }}>
                <span>
                  <span style={{ fontWeight: "600" }}>{c.name}</span>
                  {c.issuer ? (
                    <span style={{ fontWeight: "400" }}> - {c.issuer}</span>
                  ) : null}
                </span>
                {c.date && <span style={dateStyle}>{c.date}</span>}
              </div>
            ))}
        </div>
      )}

      {/* ── SKILLS ── */}
      {hasSkills && (
        <div>
          <h2 style={sectionTitle}>Skills</h2>
          {Object.entries(skillGroups).map(([cat, list]) => (
            <p key={cat} style={{ margin: "0 0 3px" }}>
              <span style={{ fontWeight: "700" }}>{cat}: </span>
              <span>{list.join(", ")}.</span>
            </p>
          ))}
        </div>
      )}

      {/* ── PROJECTS ── */}
      {hasProjects && (
        <div>
          <h2 style={sectionTitle}>Projects</h2>
          {projects.filter(p => p.name?.trim()).map((proj, i) => (
            <div key={proj.id || i} style={{ marginBottom: "7px" }}>
              <div style={row}>
                <span style={{ fontWeight: "700" }}>{proj.name}</span>
                {proj.link && (
                  <span style={{ ...dateStyle, color: "#1a6b9a" }}>{proj.link}</span>
                )}
              </div>
              {proj.technologies?.length > 0 && (
                <p style={{ margin: "1px 0", fontSize: "10pt", color: "#444" }}>
                  {proj.technologies.join(", ")}
                </p>
              )}
              {proj.description && (
                <p style={{ margin: "1px 0 0" }}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}