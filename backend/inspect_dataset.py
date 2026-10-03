import pandas as pd


# ============================================================
# 1. LOAD DATA
# ============================================================

training_data = pd.read_csv("data/Training.csv")
testing_data = pd.read_csv("data/Testing.csv")


# ============================================================
# 2. REMOVE EMPTY COLUMNS
# ============================================================

training_data = training_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)

testing_data = testing_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)


# ============================================================
# 3. BASIC INFORMATION
# ============================================================

print("\n========================================")
print("TRAINING DATA")
print("========================================")

print("Shape:", training_data.shape)

print("\nTarget column:")
print("prognosis")

print("\nNumber of diseases:")
print(training_data["prognosis"].nunique())


# ============================================================
# 4. DISEASE NAMES
# ============================================================

print("\n========================================")
print("DISEASE CLASSES")
print("========================================")

diseases = sorted(training_data["prognosis"].unique())

for number, disease in enumerate(diseases, start=1):
    print(f"{number:02d}. {disease}")


# ============================================================
# 5. DISEASE DISTRIBUTION
# ============================================================

print("\n========================================")
print("DISEASE DISTRIBUTION")
print("========================================")

print(
    training_data["prognosis"]
    .value_counts()
    .sort_index()
)


# ============================================================
# 6. DUPLICATE ANALYSIS
# ============================================================

print("\n========================================")
print("DUPLICATE ANALYSIS")
print("========================================")

total_rows = len(training_data)

duplicate_rows = training_data.duplicated().sum()

unique_rows = training_data.drop_duplicates().shape[0]

print("Total rows:", total_rows)
print("Duplicate rows:", duplicate_rows)
print("Unique rows:", unique_rows)


# ============================================================
# 7. DUPLICATES BY DISEASE
# ============================================================

print("\n========================================")
print("DUPLICATES BY DISEASE")
print("========================================")

duplicate_by_disease = (
    training_data
    .groupby("prognosis")
    .apply(lambda group: group.duplicated().sum())
    .sort_values(ascending=False)
)

print(duplicate_by_disease)


# ============================================================
# 8. FEATURE INFORMATION
# ============================================================

feature_columns = [
    column
    for column in training_data.columns
    if column != "prognosis"
]

print("\n========================================")
print("FEATURE INFORMATION")
print("========================================")

print("Number of symptom features:", len(feature_columns))

print("\nFirst 20 symptoms:")

for symptom in feature_columns[:20]:
    print("-", symptom)


# ============================================================
# 9. FEATURE VALUES
# ============================================================

print("\n========================================")
print("FEATURE VALUES")
print("========================================")

print(
    training_data[feature_columns]
    .stack()
    .value_counts()
)


# ============================================================
# 10. TESTING DATA
# ============================================================

print("\n========================================")
print("TESTING DATA")
print("========================================")

print("Shape:", testing_data.shape)

print(
    "Number of diseases in testing:",
    testing_data["prognosis"].nunique()
)

print("\nTesting diseases:")

for disease in sorted(testing_data["prognosis"].unique()):
    print("-", disease)


# ============================================================
# 11. TRAINING / TESTING DISEASE COMPARISON
# ============================================================

training_diseases = set(training_data["prognosis"])
testing_diseases = set(testing_data["prognosis"])

print("\n========================================")
print("TRAINING / TESTING COMPARISON")
print("========================================")

print(
    "Diseases in training but not testing:",
    training_diseases - testing_diseases
)

print(
    "Diseases in testing but not training:",
    testing_diseases - training_diseases
)

print(
    "Common diseases:",
    len(training_diseases & testing_diseases)
)


# ============================================================
# 12. MISSING VALUES
# ============================================================

print("\n========================================")
print("MISSING VALUES")
print("========================================")

missing = training_data.isnull().sum()

missing = missing[missing > 0]

if len(missing) == 0:
    print("No missing values found.")
else:
    print(missing)