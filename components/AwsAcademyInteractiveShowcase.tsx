"use client";

import React from "react";

interface CourseModuleDetail {
  id: string;
  idx: string;
  name: string;
  badge: string;
  level: string;
  status: "Active (1/100)" | "Enrolled" | "Fast-Track";
  url: string;
  icon: string;
  tagline: string;
  curriculum: Array<{
    unit: string;
    title: string;
    lab: string;
  }>;
  keySkills: string[];
  capstone: string;
  codeSnippet: {
    title: string;
    code: string;
  };
}

const COURSES: CourseModuleDetail[] = [
  {
    id: "spec-driven-kiro",
    idx: "01",
    name: "Spec-Driven Development dengan Kiro",
    badge: "AI-ASSISTED WORKFLOWS",
    level: "Intermediate",
    status: "Active (1/100)",
    url: "https://www.dicoding.com/academies/929",
    icon: "⚡",
    tagline: "Spec-first architecture, prompt calibration & automated contract testing.",
    curriculum: [
      { unit: "Modul 01", title: "Fondasi Spec-Driven & Schema Contracts", lab: "Definisi JSON Schema Contract" },
      { unit: "Modul 02", title: "Prompt Calibration & Kiro AI Pairing", lab: "AI Function Generation" },
      { unit: "Modul 03", title: "Verifikasi Otomatis & CI/CD Spec Fixtures", lab: "Microservice Test Governance" },
    ],
    keySkills: ["Spec-Driven Design", "Kiro AI Tooling", "Prompt Calibration", "Contract Testing"],
    capstone: "Microservice data pipeline yang sepenuhnya ter-generate dan tervalidasi via Kiro spec.",
    codeSnippet: {
      title: "kiro.spec.json",
      code: `{\n  "service": "lead-time-engine",\n  "contracts": { "input": { "state": "SP" }, "output": { "predicted_days": 2.4 } }\n}`
    }
  },
  {
    id: "aws-cloud-genai",
    idx: "02",
    name: "Belajar Dasar Cloud dan Gen AI di AWS",
    badge: "ENTERPRISE CLOUD",
    level: "Foundational / Enterprise",
    status: "Enrolled",
    url: "https://www.dicoding.com/academies/251",
    icon: "☁️",
    tagline: "Infrastruktur cloud AWS, Amazon Bedrock & Foundation Models (Claude 3, Titan).",
    curriculum: [
      { unit: "Modul 01", title: "AWS Core: S3 Data Lakes, EC2, Lambda", lab: "Deploy Serverless REST API" },
      { unit: "Modul 02", title: "Amazon Bedrock & Foundation Models", lab: "Boto3 Invoke Claude 3 Sonnet" },
      { unit: "Modul 03", title: "RAG & Enterprise Security Governance", lab: "Document Q&A RAG Pipeline" },
    ],
    keySkills: ["Amazon Web Services", "Amazon Bedrock", "AWS Lambda", "RAG Vector Architecture"],
    capstone: "Serverless generative analytics summarizer yang menganalisis dataset analitik.",
    codeSnippet: {
      title: "bedrock_invoke.py",
      code: `client = boto3.client("bedrock-runtime")\nres = client.invoke_model(modelId="anthropic.claude-3-sonnet", body=payload)`
    }
  },
  {
    id: "python-programming",
    idx: "03",
    name: "Memulai Pemrograman dengan Python",
    badge: "CORE PYTHON",
    level: "Foundational",
    status: "Fast-Track",
    url: "https://www.dicoding.com/academies/86",
    icon: "🐍",
    tagline: "Python fundamental & modular data pipeline engineering.",
    curriculum: [
      { unit: "Modul 01", title: "Struktur Data & Memory Efficiency", lab: "Data Parsing dengan Generators" },
      { unit: "Modul 02", title: "Dataclasses & Functional Paradigms", lab: "Modular Data Extractor" },
      { unit: "Modul 03", title: "Package Management & Pytest Fixtures", lab: "Production-Ready Package" },
    ],
    keySkills: ["Python 3.12", "Dataclasses", "Type Annotations", "Pytest Fixtures"],
    capstone: "Library data processing berbasis tipe statis dengan pengujian unit otomatis.",
    codeSnippet: {
      title: "data_stream.py",
      code: `@dataclass(frozen=True)\nclass OrderTx: id: str; gmv: float; installments: int`
    }
  },
  {
    id: "machine-learning-pemula",
    idx: "04",
    name: "Belajar Machine Learning untuk Pemula",
    badge: "APPLIED ML",
    level: "Foundational / Applied",
    status: "Active (1/100)",
    url: "https://www.dicoding.com/academies/184",
    icon: "🤖",
    tagline: "Scikit-Learn preprocessing, supervised/unsupervised ML & model evaluation.",
    curriculum: [
      { unit: "Modul 01", title: "Data Preprocessing & Feature Scaling", lab: "Scikit-Learn ColumnTransformer" },
      { unit: "Modul 02", title: "Supervised Classification & Clustering", lab: "Decision Trees & K-Means" },
      { unit: "Modul 03", title: "Confusion Matrix & Cross Validation", lab: "Model Evaluation k-Fold" },
    ],
    keySkills: ["Scikit-Learn", "Feature Scaling", "Cross-Validation", "Supervised ML"],
    capstone: "Model ML prediktif dengan k-fold validation yang diekspor untuk cloud serving.",
    codeSnippet: {
      title: "ml_pipeline.py",
      code: `pipeline = Pipeline([('scaler', StandardScaler()), ('clf', RandomForestClassifier())])\npipeline.fit(X, y)`
    }
  }
];

const ARCHITECTURE_STEPS = [
  { step: "01", name: "Spec & Contracts", tool: "Kiro AI / JSON Schema", desc: "Mendefinisikan input/output bounds dan kriteria pengujian sebelum coding." },
  { step: "02", name: "Preprocessing", tool: "Python 3.12 & Pandas", desc: "Transformasi fitur, encoding, handling outliers, dan standarisasi numerik." },
  { step: "03", name: "Machine Learning", tool: "Scikit-Learn & MLflow", desc: "Pelatihan algoritma klasifikasi/regresi dengan cross-validation k-fold." },
  { step: "04", name: "Generative AI", tool: "Amazon Bedrock (Claude 3)", desc: "RAG & LLM summarization untuk menerjemahkan metrik ke insight strategis." },
  { step: "05", name: "Serverless Cloud", tool: "AWS Lambda & S3", desc: "Deployment microservice REST API serverless dengan latensi sub-50ms." }
];

export function AwsAcademyInteractiveShowcase() {
  return (
    <section className="minimal-academy-showcase" aria-label="AWS AI Academy Minimalist Console">
      {/* Sleek Top Telemetry Bar */}
      <div className="minimal-telemetry-bar mono">
        <div className="telemetry-item">
          <span className="pulse-dot" />
          <span className="telemetry-label">COHORT:</span>
          <strong>AWS AI ACADEMY 2026</strong>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-item">
          <span className="telemetry-label">STATUS:</span>
          <span className="status-highlight">VERIFIED SCHOLAR ENROLLED</span>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-item">
          <span className="telemetry-label">PROGRESS:</span>
          <span className="progress-fraction-highlight">1 / 100 (1%)</span>
        </div>
      </div>

      {/* 4 Minimalist Course Cards with Floating Square Popover on Hover */}
      <div className="minimal-cards-grid">
        {COURSES.map((course) => (
          <div key={course.id} className="minimal-course-card-wrapper">
            {/* Clean Minimalist Card */}
            <div className="minimal-course-card">
              <div className="card-top-row mono">
                <span className="card-idx">{course.idx}</span>
                <span className="card-badge">{course.badge}</span>
                <span className="card-status-pill">{course.status}</span>
              </div>
              <h4 className="card-name">{course.name}</h4>
              <p className="card-tagline">{course.tagline}</p>
              <div className="card-footer-row mono">
                <span className="hover-hint">Hover for details ↗</span>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dicoding-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Dicoding ↗
                </a>
              </div>
            </div>

            {/* Floating Square Popover on Hover */}
            <div className="card-floating-square-popover" role="tooltip">
              <div className="floating-square-header mono">
                <div className="square-header-left">
                  <span className="pulse-dot" />
                  <strong>CLASS {course.idx} • {course.level.toUpperCase()}</strong>
                </div>
                <span className="square-status">{course.status}</span>
              </div>

              <h5 className="square-course-name">{course.name}</h5>

              {/* Curriculum Units */}
              <div className="square-units-list">
                <span className="mono square-section-title">STRUKTUR MODUL:</span>
                {course.curriculum.map((u) => (
                  <div key={u.unit} className="square-unit-item">
                    <span className="mono unit-tag">{u.unit}:</span>
                    <span className="unit-name">{u.title}</span>
                    <span className="mono lab-pill">Lab: {u.lab}</span>
                  </div>
                ))}
              </div>

              {/* Key Skills */}
              <div className="square-skills-row">
                <span className="mono square-section-title">SKILLS:</span>
                <div className="square-skills-chips mono">
                  {course.keySkills.map((s) => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                </div>
              </div>

              {/* Capstone */}
              <div className="square-capstone-box">
                <span className="mono capstone-label">CAPSTONE TARGET:</span>
                <p className="capstone-desc">{course.capstone}</p>
              </div>

              {/* Code Snippet Preview */}
              <div className="square-snippet-box mono">
                <div className="snippet-top">
                  <span>{course.codeSnippet.title}</span>
                </div>
                <pre><code>{course.codeSnippet.code}</code></pre>
              </div>

              <div className="floating-square-footer mono">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-dicoding-btn"
                >
                  Buka Halaman Modul di Dicoding ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimalist 5-Stage Architecture Flow with Hover Tooltips */}
      <div className="minimal-arch-section">
        <div className="minimal-arch-header mono">
          <span className="arch-label">CLOUD &amp; AI ARCHITECTURE PIPELINE</span>
          <span className="arch-hint">(Hover node untuk melihat tools &amp; perannya)</span>
        </div>

        <div className="minimal-arch-track">
          {ARCHITECTURE_STEPS.map((node, index) => (
            <React.Fragment key={node.step}>
              <div className="minimal-arch-node">
                <div className="arch-node-pill mono">
                  <span className="node-num">{node.step}</span>
                  <strong className="node-title">{node.name}</strong>
                </div>

                {/* Floating Square Tooltip on Hover */}
                <div className="arch-floating-tooltip mono" role="tooltip">
                  <div className="tooltip-top">
                    <span className="pulse-dot" />
                    <strong>STAGE {node.step}: {node.name}</strong>
                  </div>
                  <div className="tooltip-tool">Tool / Service: <span>{node.tool}</span></div>
                  <div className="tooltip-desc">{node.desc}</div>
                </div>
              </div>

              {index < ARCHITECTURE_STEPS.length - 1 && (
                <div className="minimal-arch-arrow" aria-hidden="true">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
