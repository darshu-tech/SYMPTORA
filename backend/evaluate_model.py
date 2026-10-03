import joblib
import pandas as pd


# ============================================================
# LOAD DATA
# ============================================================

training_data = pd.read_csv("data/Training.csv")
testing_data = pd.read_csv("data/Testing.csv")

training_data = training_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)

testing_data = testing_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(
    "model/symptora_model.joblib"
)

feature_columns = joblib.load(
    "model/symptom_features.joblib"
)


# ============================================================
# BUILD TRAINING PATTERN SET
# ============================================================

training_patterns = set(
    map(
        tuple,
        training_data[feature_columns].drop_duplicates().values
    )
)


# ============================================================
# FIND UNSEEN TEST PATTERNS
# ============================================================

unseen_rows = []

for index, row in testing_data.iterrows():

    pattern = tuple(
        row[feature_columns].values
    )

    if pattern not in training_patterns:
        unseen_rows.append(index)


# ============================================================
# RESULTS
# ============================================================

print("\n========================================")
print("MODEL EVALUATION")
print("========================================")

print(
    "Total testing samples:",
    len(testing_data)
)

print(
    "Testing samples already seen in training:",
    len(testing_data) - len(unseen_rows)
)

print(
    "Genuinely unseen testing samples:",
    len(unseen_rows)
)


# ============================================================
# PREDICT UNSEEN CASES
# ============================================================

if len(unseen_rows) > 0:

    unseen_data = testing_data.loc[
        unseen_rows
    ]

    predictions = model.predict(
        unseen_data[feature_columns]
    )

    probabilities = model.predict_proba(
        unseen_data[feature_columns]
    )

    classes = model.classes_

    print("\n========================================")
    print("UNSEEN TEST PREDICTIONS")
    print("========================================")

    for position, index in enumerate(unseen_rows):

        actual = testing_data.loc[
            index,
            "prognosis"
        ]

        predicted = predictions[position]

        print("\nTest sample:", index)

        print(
            "Actual disease:",
            actual
        )

        print(
            "Predicted disease:",
            predicted
        )

        if actual == predicted:
            print("Result: CORRECT")
        else:
            print("Result: INCORRECT")

        # Top 5 predictions
        probability_row = probabilities[position]

        top_indices = probability_row.argsort()[
            ::-1
        ][:5]

        print("\nTop predictions:")

        for rank, class_index in enumerate(
            top_indices,
            start=1
        ):

            print(
                f"{rank}. "
                f"{classes[class_index]} "
                f"-> "
                f"{probability_row[class_index] * 100:.2f}%"
            )


else:

    print(
        "\nNo completely unseen test patterns found."
    )