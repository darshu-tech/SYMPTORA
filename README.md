\# SYMPTORA — AI-Powered Medical Symptom Checker



SYMPTORA is an AI-powered medical symptom checker that allows users to select their symptoms and receive machine-learning-based predictions of possible conditions.



The application combines a React frontend, Flask REST API, Random Forest machine-learning model, and SQLite database into a single web application.



> \*\*Disclaimer:\*\* SYMPTORA is an educational and software-development project. Model predictions are dataset-based and are not medical diagnoses or a replacement for professional medical advice.



\---



\## Overview



SYMPTORA provides an interactive workspace where users can:



\- Create an account and securely sign in

\- Select and search symptoms

\- Analyze selected symptoms using a machine-learning model

\- View the predicted condition and top alternative predictions

\- Review previous assessments

\- Edit previous symptom assessments

\- Delete previous assessments

\- Explore supported disease/condition categories

\- View dataset-derived symptom patterns

\- Recover and reset their account password



\---



\## Key Features



\### 1. User Authentication



\- User registration

\- User login

\- Password hashing

\- Protected application pages

\- Forgot password flow

\- Password reset

\- User-specific assessment history



\### 2. Symptom Checker



Users can:



\- Search available symptoms

\- Select multiple symptoms

\- Remove selected symptoms

\- Submit symptoms for analysis

\- View the primary model prediction

\- View the top 5 model outputs

\- See the model score for each prediction



\### 3. Assessment History



Users can manage their previous assessments.



Supported operations:



\- \*\*Create\*\* — Save a new symptom assessment

\- \*\*Read\*\* — View previous assessments

\- \*\*Update\*\* — Edit symptoms and run the model again

\- \*\*Delete\*\* — Remove an assessment after confirmation



\### 4. Disease Intelligence



SYMPTORA provides information about the conditions represented by the model.



Users can:



\- Search supported conditions

\- View training record counts

\- View dataset-derived symptom patterns

\- Explore symptom frequencies represented in the training data



\### 5. Machine Learning



The application uses a \*\*Random Forest classifier\*\* trained on a symptom-disease dataset.



The model:



1\. Receives the symptoms selected by the user.

2\. Converts them into a numerical feature vector.

3\. Sends the feature vector to the trained Random Forest model.

4\. Generates prediction probabilities.

5\. Ranks the model outputs.

6\. Returns the top 5 predictions to the frontend.



\---



\## System Architecture



```text

&#x20;                   SYMPTORA

&#x20;                      │

&#x20;                      ▼

&#x20;             ┌─────────────────┐

&#x20;             │ React Frontend  │

&#x20;             │                 │

&#x20;             │ Landing         │

&#x20;             │ Login/Register  │

&#x20;             │ Dashboard       │

&#x20;             │ Symptom Checker │

&#x20;             │ History         │

&#x20;             │ Diseases        │

&#x20;             └────────┬────────┘

&#x20;                      │

&#x20;                      │ REST API

&#x20;                      ▼

&#x20;             ┌─────────────────┐

&#x20;             │ Flask Backend   │

&#x20;             │                 │

&#x20;             │ Authentication  │

&#x20;             │ Prediction API  │

&#x20;             │ History API     │

&#x20;             │ Disease API     │

&#x20;             └───────┬─────────┘

&#x20;                     │

&#x20;            ┌────────┴─────────┐

&#x20;            │                  │

&#x20;            ▼                  ▼

&#x20;     ┌──────────────┐   ┌──────────────┐

&#x20;     │ Random       │   │ SQLite       │

&#x20;     │ Forest Model │   │ Database     │

&#x20;     └──────────────┘   └──────────────┘

