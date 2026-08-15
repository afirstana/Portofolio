---
title: "ML Product Mapping System"
slug: "ml-product-mapping-system"
one_liner: "Sistem machine learning yang otomatis mencocokkan deskripsi produk supplier ke kode SKU internal."
problem: "Proses manual rawan salah input di ribuan SKU."
approach: "Bangun arsitektur multi-brand dengan active learning loop dan confidence calibration, direplikasi ke 4+ brand."
impact: "Mengurangi ketergantungan mapping manual, sistem scalable untuk brand baru."
category: "Machine learning"
tools:
  - "Python"
  - "Data Cleaning"
  - "ML Matching"
  - "System Architecture"
skills:
  - "Python"
  - "Data quality"
  - "Automation"
order: 1
system:
  - label: "Input"
    value: "Supplier descriptions"
  - label: "Logic"
    value: "Matching + confidence"
  - label: "Review"
    value: "Uncertain records"
  - label: "Output"
    value: "Controlled SKU"
lessons:
  - "Confidence needs a visible review path, not just a score."
  - "Multi-brand logic is easier to extend when the workflow is separated from one-off mapping rules."
preview:
  eyebrow: "Matching workflow"
  metrics:
    - label: "Input"
      value: "Supplier descriptions"
    - label: "Logic"
      value: "Matching + confidence"
    - label: "Review"
      value: "Uncertain records"
  takeaway: "Confidence remains visible for review."
evidence:
  - slot: "01"
    kind: "screenshot"
    title: "Input sample"
    description: "Replace with a redacted screenshot of the supplier-description input used for matching."
    alt: "Placeholder for a redacted supplier product-description input screenshot."
    image: ""
  - slot: "02"
    kind: "dashboard"
    title: "Confidence review"
    description: "Replace with a screenshot of the confidence score or human-review step."
    alt: "Placeholder for a confidence review or matching validation screenshot."
    image: ""
  - slot: "03"
    kind: "diagram"
    title: "Mapping workflow"
    description: "Replace with a visual of the source-to-SKU mapping workflow or architecture."
    alt: "Placeholder for a product mapping workflow diagram."
    image: ""
---

## Problem

Thousands of supplier descriptions had to land against a controlled internal SKU system. Manual mapping made the process slow to scale and too easy to mis-key.

## Data

The working signal is supplier product description text and its relationship to a controlled internal SKU vocabulary.

## Approach

The system combines multi-brand product logic with an active learning loop. Confidence calibration keeps uncertain matches visible for review while higher-confidence outcomes move forward.

## System

The workflow separates incoming descriptions, matching logic, confidence handling, and human review so each stage can be inspected independently.

## Impact

Mapping becomes a repeatable system rather than a recurring manual task, creating a practical path to add new brands without rebuilding the workflow.
