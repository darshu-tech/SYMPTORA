import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, accuracy_score


# ============================================================
# 1. LOAD DATA
# ============================================================

print("\n========================================")
print("SYMPTORA ML TRAINING")
print("========================================")

data_path = "data/Training.csv"

data = pd.read_csv(data_path)

print("\nOriginal dataset shape:")
print(data.shape)


# ============================================================
# 2. REMOVE EMPTY COLUMN
# ============================================================

data = data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)


# ============================================================
# 3. SEPARATE FEATURES AND TARGET
# ============================================================

feature_columns = [
    column
    for column in data.columns
    if column != "prognosis"
]

X = data[feature_columns]
y = data["prognosis"]


print("\nNumber of symptom features:")
print(len(feature_columns))

print("\nNumber of diseases:")
print(y.nunique())


# ============================================================
# 4. REMOVE DUPLICATE SYMPTOM PATTERNS
# ============================================================

combined_data = data.drop_duplicates()

print("\n========================================")
print("DUPLICATE REMOVAL")
print("========================================")

print("Original rows:", len(data))
print("Rows after deduplication:", len(combined_data))
print("Rows removed:", len(data) - len(combined_data))


X_unique = combined_data[feature_columns]
y_unique = combined_data["prognosis"]


# ============================================================
# 5. CHECK FOR CONFLICTING PATTERNS
# ============================================================

pattern_labels = (
    combined_data
    .groupby(feature_columns)["prognosis"]
    .nunique()
)

conflicting_patterns = pattern_labels[
    pattern_labels > 1
]

print("\nConflicting symptom patterns:")
print(len(conflicting_patterns))


# ============================================================
# 6. CREATE MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_features="sqrt",
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 7. STRATIFIED CROSS VALIDATION
# ============================================================

print("\n========================================")
print("5-FOLD CROSS VALIDATION")
print("========================================")

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scores = cross_val_score(
    model,
    X_unique,
    y_unique,
    cv=cv,
    scoring="accuracy"
)

print("\nFold accuracies:")

for number, score in enumerate(scores, start=1):
    print(
        f"Fold {number}: {score * 100:.2f}%"
    )

print(
    f"\nMean CV accuracy: "
    f"{scores.mean() * 100:.2f}%"
)

print(
    f"CV standard deviation: "
    f"{scores.std() * 100:.2f}%"
)


# ============================================================
# 8. TRAIN FINAL MODEL
# ============================================================

print("\n========================================")
print("FINAL MODEL TRAINING")
print("========================================")

model.fit(
    X_unique,
    y_unique
)

print("Model training completed.")


# ============================================================
# 9. TRAINING PERFORMANCE
# ============================================================

training_predictions = model.predict(X_unique)

training_accuracy = accuracy_score(
    y_unique,
    training_predictions
)

print(
    f"\nTraining accuracy: "
    f"{training_accuracy * 100:.2f}%"
)


# ============================================================
# 10. CLASSIFICATION REPORT
# ============================================================

print("\n========================================")
print("CLASSIFICATION REPORT")
print("========================================")

print(
    classification_report(
        y_unique,
        training_predictions,
        zero_division=0
    )
)


# ============================================================
# 11. SAVE MODEL
# ============================================================

os.makedirs("model", exist_ok=True)

model_path = "model/symptora_model.joblib"
features_path = "model/symptom_features.joblib"

joblib.dump(
    model,
    model_path
)

joblib.dump(
    feature_columns,
    features_path
)


# ============================================================
# 12. SAVE MODEL INFORMATION
# ============================================================

model_info = {
    "model_type": "Random Forest",
    "n_estimators": 300,
    "number_of_features": len(feature_columns),
    "number_of_classes": y_unique.nunique(),
    "training_rows_original": len(data),
    "training_rows_unique": len(X_unique),
    "cross_validation_folds": 5,
    "cross_validation_accuracy": float(scores.mean())
}

joblib.dump(
    model_info,
    "model/model_info.joblib"
)


# ============================================================
# 13. FINAL OUTPUT
# ============================================================

print("\n========================================")
print("MODEL SAVED")
print("========================================")

print(
    f"Model: {model_path}"
)

print(
    f"Features: {features_path}"
)

print(
    "Model information: "
    "model/model_info.joblib"
)

print("\nSYMPTORA ML ENGINE READY.")