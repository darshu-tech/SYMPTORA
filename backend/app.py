from flask import Flask, request, g

from flask_cors import CORS

from services.prediction_service import (
    predict_disease,
    feature_columns,
    disease_classes,
    get_disease_details,
)

from services.auth_service import (
    auth_required,
    authenticate_user,
    create_access_token,
    create_reset_request,
    create_user_account,
    public_user,
    reset_password,
)

from database import (
    initialize_database,
    create_assessment,
    get_assessments,
    update_assessment,
    delete_assessment,
)


# ============================================================
# CREATE FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# INITIALIZE DATABASE
# ============================================================

initialize_database()


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "online",
        "service": "SYMPTORA AI Engine",
    }


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/api/auth/register")
def register():

    data = request.get_json() or {}

    user, error = create_user_account(
        data.get("name"),
        data.get("email"),
        data.get("password"),
    )

    if error:
        return {
            "success": False,
            "error": error,
        }, 400

    token = create_access_token(user["id"])

    return {
        "success": True,
        "message": "Account created successfully.",
        "token": token,
        "user": public_user(user),
    }, 201


@app.post("/api/auth/login")
def login():

    data = request.get_json() or {}

    user = authenticate_user(
        data.get("email"),
        data.get("password"),
    )

    if not user:
        return {
            "success": False,
            "error": "Invalid email or password.",
        }, 401

    token = create_access_token(user["id"])

    return {
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": public_user(user),
    }


@app.get("/api/auth/me")
@auth_required
def current_user():

    return {
        "success": True,
        "user": public_user(
            g.current_user
        ),
    }


@app.post("/api/auth/forgot-password")
def forgot_password():

    data = request.get_json() or {}

    token, expires_at = create_reset_request(
        data.get("email")
    )

    # In a deployed application this token would be sent by email.
    # For the local interview/demo build we return it so the complete
    # reset flow can be tested without an SMTP provider.
    response = {
        "success": True,
        "message": (
            "If an account exists for that email, "
            "a password reset request has been created."
        ),
    }

    if token:
        response["demo_reset_token"] = token
        response["expires_at"] = expires_at

    return response


@app.post("/api/auth/reset-password")
def reset_password_route():

    data = request.get_json() or {}

    token = str(
        data.get("token") or ""
    ).strip()

    password = data.get("password")

    if not token:
        return {
            "success": False,
            "error": "Reset token is required.",
        }, 400

    success, error = reset_password(
        token,
        password,
    )

    if not success:
        return {
            "success": False,
            "error": error,
        }, 400

    return {
        "success": True,
        "message": (
            "Password reset successfully. "
            "You can now log in."
        ),
    }


# ============================================================
# GET SYMPTOMS
# ============================================================

@app.get("/api/symptoms")
def get_symptoms():

    symptoms = [
        {
            "id": index,
            "name": symptom,
        }
        for index, symptom
        in enumerate(feature_columns)
    ]

    return {
        "count": len(symptoms),
        "symptoms": symptoms,
    }


# ============================================================
# GET DISEASES
# ============================================================

@app.get("/api/diseases")
def get_diseases():

    diseases = [
        {
            "id": index,
            "name": disease,
        }
        for index, disease
        in enumerate(disease_classes)
    ]

    return {
        "count": len(diseases),
        "diseases": diseases,
    }


# ============================================================
# GET DISEASE DETAILS
# ============================================================

@app.get("/api/diseases/details")
def disease_details():

    try:

        diseases = get_disease_details()

        return {
            "success": True,
            "count": len(diseases),
            "diseases": diseases,
        }

    except Exception as error:

        print(
            "Disease details error:",
            error,
        )

        return {
            "success": False,
            "error": str(error),
        }, 500


# ============================================================
# PREDICT DISEASE
# ============================================================

@app.post("/api/predict")
@auth_required
def predict():

    data = request.get_json()

    if not data:

        return {
            "success": False,
            "error": "Request body is required.",
        }, 400

    selected_symptoms = data.get(
        "symptoms",
        [],
    )

    if not isinstance(
        selected_symptoms,
        list,
    ):

        return {
            "success": False,
            "error": "symptoms must be a list.",
        }, 400

    if len(selected_symptoms) == 0:

        return {
            "success": False,
            "error": "Please select at least one symptom.",
        }, 400

    try:

        result = predict_disease(
            selected_symptoms
        )

        primary_prediction = result[
            "predictions"
        ][0]

        confidence = primary_prediction[
            "probability"
        ]

        assessment_id = create_assessment(
            g.current_user_id,
            selected_symptoms,
            result["prediction"],
            confidence,
            result["predictions"],
        )

        result["assessment_id"] = assessment_id

        return {
            "success": True,
            "result": result,
        }

    except Exception as error:

        print(
            "Prediction error:",
            error,
        )

        return {
            "success": False,
            "error": str(error),
        }, 500


# ============================================================
# GET ASSESSMENT HISTORY
# ============================================================

@app.get("/api/history")
@auth_required
def history():

    try:

        assessments = get_assessments(
            g.current_user_id
        )

        return {
            "success": True,
            "assessments": assessments,
        }

    except Exception as error:

        print(
            "History error:",
            error,
        )

        return {
            "success": False,
            "error": str(error),
        }, 500


# ============================================================
# UPDATE ASSESSMENT
# ============================================================

@app.put("/api/history/<int:assessment_id>")
@auth_required
def update_history(assessment_id):

    data = request.get_json()

    if not data:

        return {
            "success": False,
            "error": "Request body is required.",
        }, 400

    selected_symptoms = data.get(
        "symptoms",
        [],
    )

    if not isinstance(
        selected_symptoms,
        list,
    ):

        return {
            "success": False,
            "error": "symptoms must be a list.",
        }, 400

    if len(selected_symptoms) == 0:

        return {
            "success": False,
            "error": "Please select at least one symptom.",
        }, 400

    try:

        result = predict_disease(
            selected_symptoms
        )

        primary_prediction = result[
            "predictions"
        ][0]

        confidence = primary_prediction[
            "probability"
        ]

        updated = update_assessment(
            g.current_user_id,
            assessment_id,
            selected_symptoms,
            result["prediction"],
            confidence,
            result["predictions"],
        )

        if not updated:

            return {
                "success": False,
                "error": "Assessment not found.",
            }, 404

        result["assessment_id"] = assessment_id

        return {
            "success": True,
            "result": result,
        }

    except Exception as error:

        print(
            "Update error:",
            error,
        )

        return {
            "success": False,
            "error": str(error),
        }, 500


# ============================================================
# DELETE ASSESSMENT
# ============================================================

@app.delete("/api/history/<int:assessment_id>")
@auth_required
def delete_history(assessment_id):

    try:

        deleted = delete_assessment(
            g.current_user_id,
            assessment_id,
        )

        if not deleted:

            return {
                "success": False,
                "error": "Assessment not found.",
            }, 404

        return {
            "success": True,
            "message": "Assessment deleted.",
        }

    except Exception as error:

        print(
            "Delete history error:",
            error,
        )

        return {
            "success": False,
            "error": str(error),
        }, 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )
