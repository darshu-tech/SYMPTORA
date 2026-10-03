import joblib
import pandas as pd


# ============================================================
# MODEL PATHS
# ============================================================

MODEL_PATH = "model/symptora_model.joblib"
FEATURES_PATH = "model/symptom_features.joblib"
TRAINING_DATA_PATH = "data/Training.csv"


# ============================================================
# LOAD MODEL
# ============================================================

# Load the trained Random Forest model once
# when the Flask server starts.

model = joblib.load(MODEL_PATH)

# Load the exact 132 symptom features used during training
feature_columns = joblib.load(FEATURES_PATH)


# ============================================================
# DISEASE CLASSES
# ============================================================

# Get disease names directly from the trained model.

disease_classes = [
    str(disease)
    for disease in model.classes_
]


# ============================================================
# LOAD TRAINING DATA
# ============================================================

# The Disease Library uses the same training dataset
# that was used to train the Random Forest model.

training_data = pd.read_csv(
    TRAINING_DATA_PATH
)

# Remove the unnecessary CSV index column if present.

training_data = training_data.drop(
    columns=["Unnamed: 133"],
    errors="ignore"
)


# ============================================================
# PREDICT DISEASE
# ============================================================

def predict_disease(selected_symptoms):
    """
    Convert selected symptom names into the 132-feature
    vector expected by the trained Random Forest model.
    """

    # --------------------------------------------------------
    # Normalize user input
    # --------------------------------------------------------

    selected = {
        symptom.strip().lower()
        for symptom in selected_symptoms
    }


    # --------------------------------------------------------
    # Create feature vector
    # --------------------------------------------------------

    feature_values = []

    for feature in feature_columns:

        if feature.lower() in selected:
            feature_values.append(1)

        else:
            feature_values.append(0)


    # --------------------------------------------------------
    # Convert input into DataFrame
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [feature_values],
        columns=feature_columns
    )


    # --------------------------------------------------------
    # Main prediction
    # --------------------------------------------------------

    prediction = model.predict(
        input_data
    )[0]


    # --------------------------------------------------------
    # Probability scores
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]

    classes = model.classes_


    # --------------------------------------------------------
    # Sort probabilities
    # Highest → Lowest
    # --------------------------------------------------------

    ranked_indices = probabilities.argsort()[::-1]


    # --------------------------------------------------------
    # Get Top 5 Predictions
    # --------------------------------------------------------

    top_predictions = []

    for index in ranked_indices[:5]:

        top_predictions.append(
            {
                "disease": str(
                    classes[index]
                ),

                "probability": round(
                    float(
                        probabilities[index]
                    ) * 100,
                    2
                )
            }
        )


    # --------------------------------------------------------
    # Return prediction result
    # --------------------------------------------------------

    return {

        "prediction": str(
            prediction
        ),

        "predictions": top_predictions,

        "selected_symptoms":
            selected_symptoms,

        "feature_count":
            len(feature_columns)
    }


# ============================================================
# GET DISEASE DETAILS
# ============================================================

def get_disease_details():
    """
    Generate Disease Library information from the
    actual Training.csv dataset.

    For each disease we calculate:

    - Number of training records
    - Symptoms associated with the disease
    - Frequency of each symptom
    """

    disease_details = []


    # --------------------------------------------------------
    # Process every disease
    # --------------------------------------------------------

    for disease in disease_classes:


        # Get all training records belonging
        # to the current disease.

        disease_rows = training_data[
            training_data["prognosis"] == disease
        ]


        # ----------------------------------------------------
        # Calculate symptom frequency
        # ----------------------------------------------------

        symptom_frequency = []


        for symptom in feature_columns:

            frequency = disease_rows[
                symptom
            ].sum()


            # Only include symptoms that appear
            # at least once for this disease.

            if frequency > 0:

                symptom_frequency.append(
                    {
                        "name": symptom,

                        "frequency": int(
                            frequency
                        )
                    }
                )


        # ----------------------------------------------------
        # Sort symptoms by frequency
        # Highest frequency first
        # ----------------------------------------------------

        symptom_frequency.sort(
            key=lambda item:
                item["frequency"],
            reverse=True
        )


        # ----------------------------------------------------
        # Create disease object
        # ----------------------------------------------------

        disease_details.append(
            {
                "name": disease,

                "training_records":
                    len(disease_rows),

                "symptoms":
                    symptom_frequency
            }
        )


    # --------------------------------------------------------
    # Return all diseases
    # --------------------------------------------------------

    return disease_details