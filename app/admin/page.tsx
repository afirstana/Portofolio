"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // Set custom page title
    document.title = "Content Manager | Abimael.Data";

    // Load Decap CMS script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.1.2/dist/decap-cms.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#050506", color: "#f5f5f4" }}>
      <div id="nc-root" />
    </div>
  );
}
