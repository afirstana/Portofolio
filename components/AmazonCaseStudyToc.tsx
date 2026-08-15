const sections = [
  ["overview", "Overview"],
  ["dashboard", "Data explorer"],
  ["model", "Model evaluation"],
  ["method", "Method"],
  ["limitations", "Limits"],
  ["evidence", "Evidence"],
] as const;

export function AmazonCaseStudyToc() {
  return <nav className="case-toc amazon-toc" aria-label="Amazon case study sections"><p className="mono">On this page</p>{sections.map(([id, label], index) => <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>)}</nav>;
}
