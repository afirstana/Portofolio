"use client";

import { useState } from "react";

export function ContactActions({ email, copyLabel }: { email: string; copyLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { window.location.href = `mailto:${email}`; } };
  return <button className="copy-email mono" type="button" onClick={copy}>{copied ? "Copied" : copyLabel}</button>;
}
