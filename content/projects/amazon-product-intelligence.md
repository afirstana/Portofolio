---
title: "Amazon Product Intelligence"
slug: "amazon-product-intelligence"
one_liner: "Static-first product intelligence dashboard built from 1,465 Amazon catalog and review records supplied for this portfolio."
problem: "A product and review snapshot is difficult to inspect as a flat CSV: category paths, currency-formatted prices, promotion fields, ratings, review volume, and text feedback need to be made comparable without introducing unsupported commercial claims."
approach: "A reproducible Python pipeline normalizes numeric fields, preserves missing values, derives category groups, calculates descriptive statistics and text signals, evaluates rating classifiers, and exports static JSON for browser-only exploration."
impact: "The resulting case study makes the observed dataset inspectable through filters, category comparisons, review language signals, and an explicitly limited local model demonstration—without a database, API, or server inference layer."
category: "Applied Data Science"
tools:
  - "Python"
  - "pandas"
  - "scikit-learn"
  - "TF-IDF"
  - "Static JSON"
skills:
  - "Python"
  - "Data quality"
  - "Automation"
order: 6
system:
  - label: "Source"
    value: "Amazon CSV snapshot"
  - label: "Cleaning"
    value: "Numeric parsing + categories"
  - label: "Analysis"
    value: "EDA, NLP, model evaluation"
  - label: "Delivery"
    value: "Static dashboard + local inference"
lessons:
  - "Observed ratings and review language can be analyzed without implying demand, conversion, or causality."
  - "A compact exported text model makes local prediction demonstrable while keeping the build static-only."
  - "Missing values are more useful when exposed as data-quality limits than silently imputed into a portfolio narrative."
preview:
  eyebrow: "Dataset + model snapshot"
  metrics:
    - label: "Dataset"
      value: "1,465 rows"
    - label: "Best F1"
      value: "0.7414"
    - label: "ROC–AUC"
      value: "0.8369"
  takeaway: "Static EDA, NLP, and browser-only inference."
evidence:
  - slot: "01"
    kind: "dashboard"
    title: "Dataset overview"
    description: "Replace with a screenshot of the Amazon dashboard KPI and filter state."
    alt: "Placeholder for a screenshot of the Amazon Product Intelligence overview."
    image: ""
  - slot: "02"
    kind: "screenshot"
    title: "Category drill-down"
    description: "Replace with a screenshot of a selected category, pricing distribution, or product table."
    alt: "Placeholder for a screenshot of Amazon category exploration."
    image: ""
  - slot: "03"
    kind: "diagram"
    title: "Static data pipeline"
    description: "Replace with a diagram or screenshot of the CSV-to-JSON analysis workflow."
    alt: "Placeholder for a static Amazon analysis pipeline diagram."
    image: ""
---

## Problem

The provided Amazon dataset combines product attributes, price fields, rating volume, category hierarchies, and review text in one snapshot. It needs careful parsing before comparisons are meaningful.

## Data

The raw CSV has 1,465 rows and 1,351 unique product IDs. It contains product identifiers, names, hierarchical categories, actual and discounted prices, discount percentage, rating, rating count, product descriptions, review fields, and source links.

## Approach

The reproducible pipeline uses pandas and scikit-learn to normalize numbers, retain missingness, inspect distributions, calculate category-level summaries, extract observed review-language terms, and evaluate high-rating classifiers on a stratified holdout set.

## System

The published site reads only precomputed local JSON. Every interactive filter, chart, and prediction happens in the browser; the static export makes no network request to a data service or model endpoint.

## Impact

This is an analytical case study, not a sales-performance report. Its value is a transparent, interactive reading of the supplied snapshot and an auditable workflow that can be rerun when the source file changes.

## Limitations

The source is a single catalog/review snapshot. It does not contain sales, conversion, time-series, experimental, or causal data; price and promotion comparisons are descriptive only.
