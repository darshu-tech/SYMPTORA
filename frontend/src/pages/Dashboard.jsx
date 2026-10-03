import { useEffect, useState } from "react";

import {
  getSymptoms,
  getDiseases,
  getHistory
} from "../services/api";


function Dashboard({ setActivePage }) {

  const [symptomCount, setSymptomCount] = useState(0);

  const [diseaseCount, setDiseaseCount] = useState(0);

  const [assessmentCount, setAssessmentCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // LOAD DASHBOARD DATA
  // ==========================================================

  useEffect(() => {

    async function loadDashboardData() {

      try {

        setIsLoading(true);
        setError("");

        const [
          symptomsData,
          diseasesData,
          historyData
        ] = await Promise.all([

          getSymptoms(),

          getDiseases(),

          getHistory()

        ]);


        // ----------------------------------------------------
        // SYMPTOM COUNT
        // ----------------------------------------------------

        setSymptomCount(
          symptomsData.count
        );


        // ----------------------------------------------------
        // DISEASE COUNT
        // ----------------------------------------------------

        setDiseaseCount(
          diseasesData.count
        );


        // ----------------------------------------------------
        // ASSESSMENT COUNT
        // ----------------------------------------------------

        setAssessmentCount(
          historyData.assessments.length
        );


      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );

      } finally {

        setIsLoading(false);

      }

    }


    loadDashboardData();

  }, []);


  // ==========================================================
  // START SYMPTOM CHECK
  // ==========================================================

  const startSymptomCheck = () => {

    if (setActivePage) {

      setActivePage("checker");

    }

  };


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (

    <main className="dashboard">


      {/* ======================================================
          TOP BAR
          ====================================================== */}

      <div className="top-bar">

        <div>

          <p className="eyebrow">
            AI HEALTH ASSISTANT
          </p>


          <h1>

            Understand your

            <span>
              {" "}symptoms.
            </span>

          </h1>


          <p className="subtitle">

            Analyze symptoms, explore possible conditions,
            and keep track of your previous assessments.

          </p>

        </div>


        <div className="status-card">

          <span className="status-dot"></span>

          AI ENGINE

          <strong>
            READY
          </strong>

        </div>

      </div>



      {/* ======================================================
          ERROR MESSAGE
          ====================================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}



      {/* ======================================================
          HERO CARD
          ====================================================== */}

      <section className="hero-card">

        <div className="hero-content">

          <p className="eyebrow">
            SYMPTOM ANALYSIS
          </p>


          <h2>

            How are you

            <br />

            feeling today?

          </h2>


          <p>

            Select your symptoms and let the prediction
            engine analyze the pattern.

          </p>


          <button
            type="button"
            className="primary-button"
            onClick={startSymptomCheck}
          >

            Start symptom check →

          </button>

        </div>


        <div className="hero-visual">

          <div className="pulse-ring">

            <span>
              +
            </span>

          </div>

        </div>

      </section>



      {/* ======================================================
          STATISTICS
          ====================================================== */}

      <section className="stats-grid">


        {/* ====================================================
            SYMPTOMS
            ==================================================== */}

        <div className="stat-card">

          <span>
            SYMPTOMS
          </span>


          <strong>

            {isLoading
              ? "..."
              : symptomCount}

          </strong>


          <small>
            Available in database
          </small>

        </div>



        {/* ====================================================
            CONDITIONS
            ==================================================== */}

        <div className="stat-card">

          <span>
            CONDITIONS
          </span>


          <strong>

            {isLoading
              ? "..."
              : diseaseCount}

          </strong>


          <small>
            Prediction categories
          </small>

        </div>



        {/* ====================================================
            ASSESSMENTS
            ==================================================== */}

        <div className="stat-card">

          <span>
            ASSESSMENTS
          </span>


          <strong>

            {isLoading
              ? "..."
              : assessmentCount}

          </strong>


          <small>
            Your symptom history
          </small>

        </div>


      </section>



      {/* ======================================================
          MODEL INTELLIGENCE
          ====================================================== */}

      <section className="model-intelligence">


        {/* ====================================================
            SECTION HEADER
            ==================================================== */}

        <div className="model-intelligence-header">

          <div>

            <p className="eyebrow">
              MODEL INTELLIGENCE
            </p>

            <h2>
              Inside the
              <span> prediction engine.</span>
            </h2>

          </div>


          <div className="model-badge">

            <span className="status-dot"></span>

            RANDOM FOREST

          </div>

        </div>



        {/* ====================================================
            MODEL DESCRIPTION
            ==================================================== */}

        <p className="model-description">

          SYMPTORA converts the selected symptoms into a
          numerical feature vector and sends it to the
          trained machine-learning model through the Flask API.

        </p>



        {/* ====================================================
            MODEL INFORMATION GRID
            ==================================================== */}

        <div className="model-info-grid">


          {/* MODEL */}

          <div className="model-info-card">

            <span>
              ALGORITHM
            </span>

            <strong>
              Random Forest
            </strong>

            <small>
              Classification model
            </small>

          </div>



          {/* FEATURES */}

          <div className="model-info-card">

            <span>
              INPUT FEATURES
            </span>

            <strong>
              132
            </strong>

            <small>
              Symptom features
            </small>

          </div>



          {/* CLASSES */}

          <div className="model-info-card">

            <span>
              OUTPUT CLASSES
            </span>

            <strong>
              41
            </strong>

            <small>
              Condition categories
            </small>

          </div>



          {/* TRAINING DATA */}

          <div className="model-info-card">

            <span>
              TRAINING RECORDS
            </span>

            <strong>
              4,920
            </strong>

            <small>
              Dataset records
            </small>

          </div>



          {/* VALIDATION */}

          <div className="model-info-card">

            <span>
              VALIDATION
            </span>

            <strong>
              5-FOLD
            </strong>

            <small>
              Stratified cross-validation
            </small>

          </div>



          {/* OUTPUT */}

          <div className="model-info-card">

            <span>
              MODEL OUTPUT
            </span>

            <strong>
              TOP 5
            </strong>

            <small>
              Ranked predictions
            </small>

          </div>


        </div>



        {/* ====================================================
            MODEL PIPELINE
            ==================================================== */}

        <div className="model-pipeline">

          <div className="pipeline-step">

            <span className="pipeline-number">
              01
            </span>

            <div>

              <strong>
                Symptoms
              </strong>

              <small>
                User selection
              </small>

            </div>

          </div>


          <div className="pipeline-arrow">
            →
          </div>


          <div className="pipeline-step">

            <span className="pipeline-number">
              02
            </span>

            <div>

              <strong>
                Feature Vector
              </strong>

              <small>
                132 binary features
              </small>

            </div>

          </div>


          <div className="pipeline-arrow">
            →
          </div>


          <div className="pipeline-step">

            <span className="pipeline-number">
              03
            </span>

            <div>

              <strong>
                Random Forest
              </strong>

              <small>
                ML inference
              </small>

            </div>

          </div>


          <div className="pipeline-arrow">
            →
          </div>


          <div className="pipeline-step">

            <span className="pipeline-number">
              04
            </span>

            <div>

              <strong>
                Prediction
              </strong>

              <small>
                Ranked output
              </small>

            </div>

          </div>

        </div>



        {/* ====================================================
            TRANSPARENCY NOTE
            ==================================================== */}

        <div className="model-note">

          <span>
            ⓘ
          </span>

          <p>

            Model scores represent the Random Forest output
            for the selected symptom pattern. They are not
            clinical probabilities or a medical diagnosis.

          </p>

        </div>


      </section>


    </main>

  );

}


export default Dashboard;