# Amazon Product Intelligence — Reproducibility Notes

This case study is derived from the user-supplied `archive.zip`, which contains `amazon.csv`. The interactive site consumes only derived, static JSON files from `public/data/amazon/`; it does not call an API, use a database, or run an inference server.

## Dataset schema

| Field | Observed representation | Analysis use |
|---|---|---|
| `product_id` | Amazon-like product identifier | Product uniqueness and record key |
| `product_name` | Product title text | Dashboard label and product search |
| `category` | Pipe-delimited category hierarchy | Category explorer and top-level grouping |
| `discounted_price` | Indian rupee-formatted price text | Price analysis |
| `actual_price` | Indian rupee-formatted price text | Price analysis and discount derivation |
| `discount_percentage` | Percent-formatted text | Promotion analysis |
| `rating` | Numeric text | Rating distribution and high-rating target |
| `rating_count` | Comma-formatted numeric text | Rating-volume analysis |
| `about_product` | Product-description text | NLP and text-model input |
| `user_id`, `user_name`, `review_id` | Comma-delimited review metadata | Preserved in raw source; not exposed in the site artifact |
| `review_title`, `review_content` | Review text | NLP and text-model input |
| `img_link`, `product_link` | External URLs | Preserved in raw source; intentionally not loaded by the static site |

The supplied file contains **1,465 rows**, **1,351 unique product IDs**, **211 category paths**, and **9 top-level category groups**. It has no exact duplicate rows. After numeric normalization, there is one missing rating and two missing rating-count values; they remain missing rather than being invented. These counts are regenerated in `analysis-summary.json`.

## Reproduce the analysis

1. Place the original `amazon.csv` anywhere outside the public build folder.
2. Install the local Python packages: `pandas`, `numpy`, and `scikit-learn`.
3. Run the following command from the repository root.

```bash
python3 analysis/amazon/analyze_amazon.py \
  --input /path/to/amazon.csv \
  --out /tmp/amazon-output
```

4. Copy `amazon-dashboard.json` and `amazon-model.json` from the output folder into `public/data/amazon/`.
5. Run `pnpm build`. The source bundle includes `analysis/` and `public/` so the downloadable static export retains the pipeline and local artifacts.

> The script normalizes currency/percentage strings, derives a missing discount only where both price fields exist, removes exact duplicate rows, splits the first category hierarchy segment into a top-level group, and retains missing values otherwise.

## Model protocol and limits

The binary target is **high rating = rating ≥ 4.2**. A stratified 75/25 split with `random_state=42` is used. The evaluated models are majority-class baseline, structured logistic regression, TF-IDF plus logistic regression, and TF-IDF plus linear SVM. On the held-out set of 366 records, the best observed model is the TF-IDF linear SVM with **F1 0.7414** and **ROC-AUC 0.8369**. The client-side prediction control deliberately uses the exported TF-IDF logistic-regression model because it can be represented as compact JSON; it is an illustrative local inference surface, not a production decision system.

The source dataset is a product/review snapshot with no observed sales, conversion, time series, experimental treatment, or causal labels. The dashboard therefore does not claim demand, revenue, conversion, causal promotion effects, or generalization beyond this dataset.

## Portfolio provenance

The source bundle generated in `out/source/` includes this documentation, the Python pipeline, the Markdown case study entry, and the local JSON artifacts. A public repository URL was not supplied for this portfolio, so the published case study intentionally omits a “View on GitHub” call to action rather than presenting a fabricated link.
