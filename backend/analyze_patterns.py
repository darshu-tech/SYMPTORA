import pandas as pd


# ============================================================
# LOAD DATA
# ============================================================

training_data = pd.read_csv("data/Training.csv")
testing_data = pd.read_csv("data/Testing.csv")


# Remove completely empty column
training_data = training_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)

testing_data = testing_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)


# ============================================================
# SEPARATE FEATURES AND TARGET
# ============================================================

feature_columns = [
    column
    for column in training_data.columns
    if column != "prognosis"
]

X = training_data[feature_columns]
y = training_data["prognosis"]


# ============================================================
# UNIQUE SYMPTOM PATTERNS
# ============================================================

unique_patterns = X.drop_duplicates()

print("\n========================================")
print("SYMPTOM PATTERN ANALYSIS")
print("========================================")

print("Total training rows:", len(X))
print("Unique symptom patterns:", len(unique_patterns))
print("Duplicate symptom patterns:", len(X) - len(unique_patterns))


# ============================================================
# CHECK WHETHER ONE SYMPTOM PATTERN HAS
# MULTIPLE DISEASE LABELS
# ============================================================

pattern_with_labels = (
    training_data
    .groupby(feature_columns, dropna=False)["prognosis"]
    .nunique()
)

conflicting_patterns = pattern_with_labels[
    pattern_with_labels > 1
]

print("\n========================================")
print("CONFLICTING SYMPTOM PATTERNS")
print("========================================")

print(
    "Patterns associated with multiple diseases:",
    len(conflicting_patterns)
)


# ============================================================
# UNIQUE PATTERNS PER DISEASE
# ============================================================

unique_training = training_data.drop_duplicates()

unique_per_disease = (
    unique_training["prognosis"]
    .value_counts()
    .sort_index()
)

print("\n========================================")
print("UNIQUE PATTERNS PER DISEASE")
print("========================================")

print(unique_per_disease)


# ============================================================
# MOST COMMON SYMPTOM COUNTS
# ============================================================

symptom_counts = X.sum(axis=1)

print("\n========================================")
print("SYMPTOMS PER RECORD")
print("========================================")

print("Minimum symptoms:", symptom_counts.min())
print("Maximum symptoms:", symptom_counts.max())
print("Average symptoms:", round(symptom_counts.mean(), 2))


# ============================================================
# TEST SET CHECK
# ============================================================

test_features = testing_data[feature_columns]

training_pattern_set = set(
    map(tuple, X.drop_duplicates().values)
)

test_patterns = list(
    map(tuple, test_features.values)
)

overlap = sum(
    pattern in training_pattern_set
    for pattern in test_patterns
)

print("\n========================================")
print("TRAINING / TEST OVERLAP")
print("========================================")

print(
    "Testing patterns also present in training:",
    overlap
)

print(
    "Total testing patterns:",
    len(test_patterns)
)