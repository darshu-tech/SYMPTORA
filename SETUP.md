# SYMPTORA — Setup Guide

## Project architecture

```text
React + Vite
     ↓
Flask REST API
     ↓
JWT Authentication ─── SQLite
     ↓
Random Forest model
```

## 1. Backend

Open a terminal:

```powershell
cd D:\SympTora\backend
```

Create/activate the virtual environment if needed:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start Flask:

```powershell
python app.py
```

Expected:

```text
http://127.0.0.1:5000
```

## 2. Frontend

Open a second terminal:

```powershell
cd D:\SympTora\frontend
npm install
npm run dev
```

Expected:

```text
http://localhost:5173
```

## 3. First application flow

```text
Landing Page
    ↓
Create Account / Sign In
    ↓
Dashboard
    ↓
Symptom Check
    ↓
Random Forest Prediction
    ↓
History
```

## 4. Authentication

- Passwords are hashed with Werkzeug.
- Login creates a signed JWT.
- The token is stored locally in the browser.
- Protected API endpoints require the JWT.
- Assessment records belong to a user.
- The first account created on the existing local database claims legacy anonymous assessments so previous local history is not lost.
- Later users can only see their own assessments.

## 5. Password reset

The local/demo version creates a short-lived reset token.

In a production deployment, the token should be delivered through a verified email provider instead of being returned by the API.

## 6. Security note

Before deployment, set a strong environment variable:

```powershell
$env:SYMPTORA_JWT_SECRET="your-long-random-secret"
```

Do not commit production secrets to GitHub.

## 7. Important existing ML files

The authentication upgrade does not replace the existing:

```text
backend/data/Training.csv
backend/data/Testing.csv
backend/model/symptora_model.joblib
backend/model/symptom_features.joblib
backend/model/model_info.joblib
```

The Random Forest prediction flow remains the same; authentication now protects the prediction and assessment-history operations.
