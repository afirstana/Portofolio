from __future__ import annotations

import argparse
import json
import math
import re
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.svm import LinearSVC


STOPWORDS = set(ENGLISH_STOP_WORDS) | {
    "amazon", "product", "products", "buy", "bought", "using", "use", "used",
    "like", "really", "also", "would", "could", "one", "get", "got", "the",
    "and", "for", "with", "this", "that", "from", "was", "are", "have", "has",
}
TOKEN_RE = re.compile(r"[a-z]{2,}")


def json_safe(value):
    if value is None or (isinstance(value, float) and (math.isnan(value) or math.isinf(value))):
        return None
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return round(float(value), 6)
    return value


def parse_number(value: object) -> float | None:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    text = str(value).strip()
    if not text or text.lower() in {"nan", "none", "null"}:
        return None
    match = re.search(r"-?[\d][\d,]*(?:\.\d+)?", text.replace("₹", ""))
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


def parse_percent(value: object) -> float | None:
    return parse_number(value)


def clean_text(*values: object) -> str:
    parts = []
    for value in values:
        if value is None or (isinstance(value, float) and math.isnan(value)):
            continue
        text = re.sub(r"\s+", " ", str(value)).strip()
        if text and text.lower() not in {"nan", "none"}:
            parts.append(text)
    return " ".join(parts)


def tokens(text: str) -> list[str]:
    return [token for token in TOKEN_RE.findall(text.lower()) if token not in STOPWORDS]


def top_terms(series: pd.Series, limit: int = 12) -> list[dict[str, object]]:
    counts: Counter[str] = Counter()
    for text in series.dropna().astype(str):
        counts.update(tokens(text))
    return [{"term": term, "count": int(count)} for term, count in counts.most_common(limit)]


def histogram(series: pd.Series, bins: int = 10, minimum: float | None = None, maximum: float | None = None):
    values = series.dropna().astype(float).to_numpy()
    if len(values) == 0:
        return []
    hist, edges = np.histogram(values, bins=bins, range=(minimum, maximum) if minimum is not None else None)
    return [
        {
            "start": round(float(edges[i]), 4),
            "end": round(float(edges[i + 1]), 4),
            "count": int(hist[i]),
        }
        for i in range(len(hist))
    ]


def metric_row(name: str, y_true, predicted, score, model_type: str) -> dict[str, object]:
    try:
        auc = roc_auc_score(y_true, score)
    except ValueError:
        auc = None
    return {
        "name": name,
        "type": model_type,
        "accuracy": round(float(accuracy_score(y_true, predicted)), 4),
        "precision": round(float(precision_score(y_true, predicted, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, predicted, zero_division=0)), 4),
        "f1": round(float(f1_score(y_true, predicted, zero_division=0)), 4),
        "rocAuc": round(float(auc), 4) if auc is not None else None,
    }


def build_models(frame: pd.DataFrame) -> tuple[dict[str, object], dict[str, object]]:
    usable = frame.dropna(subset=["rating"]).copy()
    threshold = 4.2
    initial_target = (usable["rating"] >= threshold).astype(int)
    minority_share = min(initial_target.mean(), 1 - initial_target.mean())
    threshold_note = "High Rating is defined as rating ≥ 4.2, as specified for this case study."
    if minority_share < 0.08:
        threshold = round(float(usable["rating"].median()), 1)
        initial_target = (usable["rating"] >= threshold).astype(int)
        threshold_note = (
            f"The requested 4.2 threshold created a minority class below 8%; the threshold was adjusted to the dataset median ({threshold}) to support stratified evaluation."
        )
    usable["target"] = initial_target
    class_counts = usable["target"].value_counts().sort_index()
    if len(class_counts) < 2 or class_counts.min() < 12:
        return (
            {
                "status": "insufficient-class-variation",
                "threshold": threshold,
                "thresholdNote": threshold_note,
                "classDistribution": [{"label": str(key), "count": int(value)} for key, value in class_counts.items()],
                "models": [],
                "message": "The cleaned dataset does not contain enough examples in both classes for a defensible held-out evaluation.",
            },
            {},
        )

    train, test = train_test_split(
        usable, test_size=0.25, random_state=42, stratify=usable["target"]
    )
    y_train, y_test = train["target"], test["target"]
    majority = int(y_train.mode().iloc[0])
    baseline_pred = np.full(len(test), majority)
    baseline_score = np.full(len(test), y_train.mean())
    models = [metric_row("Majority Class Baseline", y_test, baseline_pred, baseline_score, "baseline")]

    numeric_features = ["actual_price", "discounted_price", "discount_percentage", "rating_count", "text_length"]
    categorical_features = ["top_category"]
    structured = Pipeline(
        [
            (
                "features",
                ColumnTransformer(
                    [
                        (
                            "numeric",
                            Pipeline([
                                ("imputer", SimpleImputer(strategy="median")),
                                ("scaler", StandardScaler()),
                            ]),
                            numeric_features,
                        ),
                        (
                            "category",
                            Pipeline([
                                ("imputer", SimpleImputer(strategy="most_frequent")),
                                ("onehot", OneHotEncoder(handle_unknown="ignore")),
                            ]),
                            categorical_features,
                        ),
                    ]
                ),
            ),
            ("model", LogisticRegression(max_iter=1200, class_weight="balanced", random_state=42)),
        ]
    )
    structured.fit(train, y_train)
    structured_prob = structured.predict_proba(test)[:, 1]
    structured_pred = (structured_prob >= 0.5).astype(int)
    models.append(metric_row("Structured Features", y_test, structured_pred, structured_prob, "structured"))

    train_text = train["model_text"].fillna("")
    test_text = test["model_text"].fillna("")
    vectorizer = TfidfVectorizer(max_features=800, ngram_range=(1, 2), min_df=2, stop_words="english")
    train_tfidf = vectorizer.fit_transform(train_text)
    test_tfidf = vectorizer.transform(test_text)
    text_lr = LogisticRegression(max_iter=1200, class_weight="balanced", random_state=42)
    text_lr.fit(train_tfidf, y_train)
    text_lr_prob = text_lr.predict_proba(test_tfidf)[:, 1]
    text_lr_pred = (text_lr_prob >= 0.5).astype(int)
    models.append(metric_row("TF-IDF + Logistic Regression", y_test, text_lr_pred, text_lr_prob, "text-logistic"))

    text_svm = LinearSVC(class_weight="balanced", random_state=42)
    text_svm.fit(train_tfidf, y_train)
    text_svm_score = text_svm.decision_function(test_tfidf)
    text_svm_pred = (text_svm_score >= 0).astype(int)
    models.append(metric_row("TF-IDF + Linear SVM", y_test, text_svm_pred, text_svm_score, "text-svm"))

    best = max(models[1:], key=lambda model: (model["f1"], model["rocAuc"] or 0))
    best_name = str(best["name"])
    if best_name == "Structured Features":
        best_pred = structured_pred
    elif best_name == "TF-IDF + Logistic Regression":
        best_pred = text_lr_pred
    else:
        best_pred = text_svm_pred
    cm = confusion_matrix(y_test, best_pred, labels=[1, 0])

    feature_names = vectorizer.get_feature_names_out()
    coefficients = text_lr.coef_[0]
    ranked = sorted(zip(feature_names, coefficients), key=lambda pair: pair[1])
    negative_terms = [{"term": term, "weight": round(float(weight), 4)} for term, weight in ranked[:10]]
    positive_terms = [{"term": term, "weight": round(float(weight), 4)} for term, weight in ranked[-10:][::-1]]

    model_data = {
        "status": "evaluated",
        "threshold": threshold,
        "thresholdNote": threshold_note,
        "classDistribution": [{"label": "High rating", "count": int((usable["target"] == 1).sum())}, {"label": "Not high rating", "count": int((usable["target"] == 0).sum())}],
        "split": {"train": int(len(train)), "test": int(len(test)), "randomState": 42, "stratified": True},
        "models": models,
        "bestModel": best_name,
        "confusionMatrix": {
            "truePositive": int(cm[0, 0]),
            "falseNegative": int(cm[0, 1]),
            "falsePositive": int(cm[1, 0]),
            "trueNegative": int(cm[1, 1]),
            "labelOrder": "rows: actual high/not-high; columns: predicted high/not-high",
        },
        "explainability": {
            "model": "TF-IDF + Logistic Regression",
            "note": "Terms and weights are extracted from the trained logistic-regression coefficient vector, not hard-coded sentiment words.",
            "positiveTerms": positive_terms,
            "negativeTerms": negative_terms,
        },
    }
    inference_data = {
        "modelName": "TF-IDF + Logistic Regression",
        "threshold": threshold,
        "intercept": round(float(text_lr.intercept_[0]), 8),
        "vocabulary": {term: int(index) for term, index in vectorizer.vocabulary_.items()},
        "idf": [round(float(value), 8) for value in vectorizer.idf_],
        "coefficients": [round(float(value), 8) for value in coefficients],
        "tokenPattern": "[a-z]{2,}",
        "maxFeatures": int(len(feature_names)),
        "note": "This is an exported, client-side representation of the trained text Logistic Regression model. Product category, price, and discount inputs are displayed as context but are not features in this text-only inference model.",
    }
    return model_data, inference_data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    output = Path(args.out)
    output.mkdir(parents=True, exist_ok=True)

    raw = pd.read_csv(args.input)
    raw.columns = [str(column).strip() for column in raw.columns]
    frame = raw.copy()
    for column in ["actual_price", "discounted_price", "discount_percentage", "rating", "rating_count"]:
        frame[column] = frame[column].map(parse_percent if column == "discount_percentage" else parse_number)
    for column in ["product_name", "category", "product_id"]:
        frame[column] = frame[column].fillna("").astype(str).str.strip()
    frame["top_category"] = frame["category"].str.split("|").str[0].str.strip().replace("", "Uncategorized")
    frame["review_text"] = frame.apply(lambda row: clean_text(row.get("review_title"), row.get("review_content")), axis=1)
    frame["about_text"] = frame["about_product"].map(lambda value: clean_text(value))
    frame["model_text"] = (frame["review_text"] + " " + frame["about_text"]).str.strip()
    frame["text_length"] = frame["model_text"].str.split().str.len().fillna(0).astype(int)
    derived_discount = ((frame["actual_price"] - frame["discounted_price"]) / frame["actual_price"] * 100)
    frame["discount_percentage"] = frame["discount_percentage"].fillna(derived_discount).clip(lower=0, upper=100)
    before = len(frame)
    exact_duplicates = int(frame.duplicated().sum())
    frame = frame.drop_duplicates().reset_index(drop=True)

    rating_complete = frame.dropna(subset=["rating"]).copy()
    product_records = []
    for _, row in rating_complete.iterrows():
        product_records.append(
            {
                "id": str(row["product_id"]),
                "name": str(row["product_name"]),
                "category": str(row["category"]),
                "topCategory": str(row["top_category"]),
                "actualPrice": json_safe(row["actual_price"]),
                "discountedPrice": json_safe(row["discounted_price"]),
                "discountPercentage": json_safe(row["discount_percentage"]),
                "rating": json_safe(row["rating"]),
                "ratingCount": json_safe(row["rating_count"]),
            }
        )

    category_counts = (
        frame.groupby("category", dropna=False)
        .size()
        .reset_index(name="records")
        .sort_values("records", ascending=False)
    )
    category_distribution = [
        {
            "category": str(row["category"] or "Uncategorized"),
            "records": int(row["records"]),
            "percent": round(float(row["records"] / len(frame) * 100), 2),
        }
        for _, row in category_counts.head(10).iterrows()
    ]
    category_stats = (
        frame.groupby("category", dropna=False)
        .agg(
            productCount=("product_id", "size"),
            averageRating=("rating", "mean"),
            averageDiscount=("discount_percentage", "mean"),
            medianPrice=("discounted_price", "median"),
            averageRatingCount=("rating_count", "mean"),
        )
        .reset_index()
        .sort_values("productCount", ascending=False)
    )
    category_stats_data = [
        {
            "category": str(row["category"] or "Uncategorized"),
            "productCount": int(row["productCount"]),
            "averageRating": json_safe(row["averageRating"]),
            "averageDiscount": json_safe(row["averageDiscount"]),
            "medianPrice": json_safe(row["medianPrice"]),
            "averageRatingCount": json_safe(row["averageRatingCount"]),
        }
        for _, row in category_stats.iterrows()
    ]

    review_with_rating = frame.dropna(subset=["rating"]).copy()
    high_reviews = review_with_rating[review_with_rating["rating"] >= 4.2]
    low_reviews = review_with_rating[review_with_rating["rating"] < 4.2]
    correlation_rating_volume = frame[["rating", "rating_count"]].dropna().corr().iloc[0, 1]
    correlation_discount_rating = frame[["discount_percentage", "rating"]].dropna().corr().iloc[0, 1]

    model_data, inference_data = build_models(frame)
    dashboard_data = {
        "dataset": {
            "sourceFile": Path(args.input).name,
            "sourceRows": int(before),
            "cleanRows": int(len(frame)),
            "uniqueProducts": int(frame["product_id"].nunique()),
            "uniqueCategories": int(frame["category"].replace("", np.nan).nunique()),
            "topLevelCategories": int(frame["top_category"].nunique()),
            "generatedAt": "Static build artifact generated locally from the supplied CSV.",
        },
        "quality": {
            "exactDuplicateRowsRemoved": exact_duplicates,
            "missingByField": {column: int(frame[column].isna().sum()) for column in ["actual_price", "discounted_price", "discount_percentage", "rating", "rating_count"]},
            "cleaningRules": [
                "Normalized numeric price, discount, rating, and rating-count strings.",
                "Derived missing discount percentage only when actual and discounted price were available.",
                "Removed exact duplicate rows and retained missing values instead of inventing replacements.",
                "Built top-level category from the first category hierarchy segment.",
            ],
        },
        "distributions": {
            "rating": histogram(frame["rating"], bins=10, minimum=0, maximum=5),
            "discount": histogram(frame["discount_percentage"], bins=10, minimum=0, maximum=100),
        },
        "categoryDistribution": category_distribution,
        "categoryStats": category_stats_data,
        "correlations": {
            "ratingVsRatingCount": json_safe(correlation_rating_volume),
            "discountVsRating": json_safe(correlation_discount_rating),
        },
        "scatter": {
            "ratingVsCount": [
                {"name": str(row["product_name"]), "category": str(row["category"]), "x": json_safe(row["rating_count"]), "y": json_safe(row["rating"])}
                for _, row in frame.dropna(subset=["rating", "rating_count"]).iterrows()
            ],
            "actualVsDiscounted": [
                {"name": str(row["product_name"]), "category": str(row["category"]), "x": json_safe(row["actual_price"]), "y": json_safe(row["discounted_price"]), "discount": json_safe(row["discount_percentage"])}
                for _, row in frame.dropna(subset=["actual_price", "discounted_price"]).iterrows()
            ],
            "discountVsRating": [
                {"name": str(row["product_name"]), "category": str(row["category"]), "x": json_safe(row["discount_percentage"]), "y": json_safe(row["rating"])}
                for _, row in frame.dropna(subset=["discount_percentage", "rating"]).iterrows()
            ],
        },
        "reviewIntelligence": {
            "reviewRecords": int((frame["review_text"].str.len() > 0).sum()),
            "averageReviewWords": round(float(frame.loc[frame["review_text"].str.len() > 0, "review_text"].str.split().str.len().mean()), 2),
            "positiveTerms": top_terms(high_reviews["review_text"]),
            "negativeTerms": top_terms(low_reviews["review_text"]),
            "method": "Lowercase tokenization, punctuation normalization, and English stopword removal. Terms are corpus-frequency signals within observed high- and lower-rating subsets; they are not sentiment labels.",
        },
        "productRecords": product_records,
    }
    with (output / "amazon-dashboard.json").open("w", encoding="utf-8") as file:
        json.dump(dashboard_data, file, ensure_ascii=False, separators=(",", ":"))
    with (output / "amazon-model.json").open("w", encoding="utf-8") as file:
        json.dump({"evaluation": model_data, "inference": inference_data}, file, ensure_ascii=False, separators=(",", ":"))
    with (output / "analysis-summary.json").open("w", encoding="utf-8") as file:
        json.dump({"dataset": dashboard_data["dataset"], "quality": dashboard_data["quality"], "model": model_data}, file, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
