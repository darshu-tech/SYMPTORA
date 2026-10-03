import { useEffect, useState } from "react";

import AnalysisLoader from "../components/AnalysisLoader";
import {
  getSymptoms,
  predictDisease
} from "../services/api";


function SymptomChecker() {

  const [symptoms, setSymptoms] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState([]);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [predictionResult, setPredictionResult] =
    useState(null);

  const [error, setError] = useState("");


  // ==========================================================
  // LOAD SYMPTOMS FROM FLASK
  // ==========================================================

  useEffect(() => {

    async function loadSymptoms() {

      try {

        const data = await getSymptoms();

        setSymptoms(data.symptoms);

      } catch (error) {

        console.error(error);

        setError(
          "Unable to connect to the AI engine."
        );

      }

    }

    loadSymptoms();

  }, []);


  // ==========================================================
  // SEARCH SYMPTOMS
  // ==========================================================

  const filteredSymptoms = symptoms.filter(
    (item) =>
      item.name
        .replaceAll("_", " ")
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
  );


  // ==========================================================
  // TOGGLE SYMPTOM
  // ==========================================================

  const toggleSymptom = (symptom) => {

    setError("");

    if (selectedSymptoms.includes(symptom)) {

      setSelectedSymptoms(
        selectedSymptoms.filter(
          (item) => item !== symptom
        )
      );

    } else {

      setSelectedSymptoms([
        ...selectedSymptoms,
        symptom
      ]);

    }

  };


  // ==========================================================
  // REMOVE SYMPTOM
  // ==========================================================

  const removeSymptom = (symptomToRemove) => {

    setSelectedSymptoms(
      selectedSymptoms.filter(
        (symptom) =>
          symptom !== symptomToRemove
      )
    );

    setError("");

  };


  // ==========================================================
  // START NEW CHECK
  // ==========================================================

  const startNewCheck = () => {

    setPredictionResult(null);

    setSelectedSymptoms([]);

    setSearchTerm("");

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ==========================================================
  // ANALYZE SYMPTOMS
  // ==========================================================

  const analyzeSymptoms = async () => {

    // --------------------------------------------------------
    // NO SYMPTOMS
    // --------------------------------------------------------

    if (selectedSymptoms.length === 0) {

      setError(
        "Please select at least 3 symptoms before analysis."
      );

      return;

    }


    // --------------------------------------------------------
    // TOO FEW SYMPTOMS
    // --------------------------------------------------------

    if (selectedSymptoms.length < 3) {

      setError(
        "Please select at least 3 symptoms for a more meaningful analysis."
      );

      return;

    }


    setError("");

    setIsAnalyzing(true);


    try {

      const data = await predictDisease(
        selectedSymptoms
      );


      setPredictionResult(
        data.result
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to analyze symptoms. Please check the AI engine."
      );

      setIsAnalyzing(false);

      return;

    }


    setIsAnalyzing(false);

  };


  // ==========================================================
  // RESULT SCREEN
  // ==========================================================

  if (predictionResult) {

    const primaryPrediction =
      predictionResult.predictions?.[0];

    const confidence =
      primaryPrediction?.probability ?? 0;


    return (

      <main className="dashboard">


        {/* ====================================================
            RESULT HEADER
        ==================================================== */}

        <div className="top-bar">

          <div>

            <p className="eyebrow">
              AI ANALYSIS COMPLETE
            </p>


            <h1>

              Your symptom

              <span>
                {" "}analysis.
              </span>

            </h1>


            <p className="subtitle">

              The SYMPTORA prediction engine has
              analyzed your selected symptom pattern.

            </p>

          </div>


          <div className="status-card">

            <span className="status-dot"></span>

            AI ENGINE

            <strong>
              COMPLETE
            </strong>

          </div>

        </div>



        {/* ====================================================
            RESULT CARD
        ==================================================== */}

        <section className="result-card">


          {/* ==================================================
              PRIMARY PREDICTION
          ================================================== */}

          <div className="result-header">

            <div>

              <p className="eyebrow">
                PRIMARY PREDICTION
              </p>


              <h2>
                {predictionResult.prediction}
              </h2>

            </div>


            {/* MODEL CONFIDENCE */}

            <div className="confidence-card">

              <span>
                MODEL SCORE
              </span>

              <strong>
                {confidence}%
              </strong>

            </div>

          </div>



          {/* ==================================================
              EXPLANATION
          ================================================== */}

          <p className="result-warning">

            This is a machine-learning prediction from
            the SYMPTORA Random Forest model based on
            the selected symptoms. It is not a medical
            diagnosis.

          </p>



          {/* ==================================================
              SELECTED SYMPTOMS
          ================================================== */}

          <div className="result-section">

            <div className="selected-heading">

              <span>
                ANALYZED SYMPTOMS
              </span>

              <strong>
                {predictionResult.selected_symptoms?.length ||
                  selectedSymptoms.length}
              </strong>

            </div>


            <div className="result-symptom-chips">

              {(
                predictionResult.selected_symptoms ||
                selectedSymptoms
              ).map(
                (symptom) => (

                  <span
                    className="result-symptom-chip"
                    key={symptom}
                  >

                    {symptom.replaceAll(
                      "_",
                      " "
                    )}

                  </span>

                )
              )}

            </div>

          </div>



          {/* ==================================================
              MODEL OUTPUT
          ================================================== */}

          <div className="prediction-list">

            <div className="selected-heading">

              <span>
                MODEL OUTPUT
              </span>

              <strong>
                {predictionResult.predictions.length}
              </strong>

            </div>


            <div className="prediction-results">

              {predictionResult.predictions.map(
                (item, index) => (

                  <div
                    className="prediction-item"
                    key={item.disease}
                  >


                    {/* TOP ROW */}

                    <div className="prediction-item-top">

                      <div>

                        <span className="prediction-rank">

                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </span>


                        <strong>
                          {item.disease}
                        </strong>

                      </div>


                      <span className="prediction-score">

                        {item.probability}%

                      </span>

                    </div>



                    {/* SCORE BAR */}

                    <div className="prediction-bar">

                      <div
                        className="prediction-bar-fill"
                        style={{
                          width:
                            `${item.probability}%`
                        }}
                      ></div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>



          {/* ==================================================
              MODEL INFORMATION
          ================================================== */}

          <div className="model-summary">

            <div>

              <span>
                MODEL
              </span>

              <strong>
                Random Forest
              </strong>

            </div>


            <div>

              <span>
                FEATURES
              </span>

              <strong>
                {predictionResult.feature_count}
              </strong>

            </div>


            <div>

              <span>
                OUTPUT
              </span>

              <strong>
                TOP 5
              </strong>

            </div>

          </div>



          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="result-disclaimer">

            <span>
              ⓘ
            </span>

            <p>

              Model scores represent the Random Forest
              output for the selected symptom pattern.
              They are not clinical probabilities,
              medical advice, or a diagnosis.

            </p>

          </div>



          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="result-actions">

            <button
              type="button"
              className="primary-button"
              onClick={startNewCheck}
            >

              New symptom check →

            </button>

          </div>


        </section>

      </main>

    );

  }



  // ==========================================================
  // MAIN CHECKER
  // ==========================================================

  return (

    <main className="dashboard">


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="top-bar">

        <div>

          <p className="eyebrow">
            SYMPTOM ANALYSIS
          </p>


          <h1>

            Let's understand

            <span>
              {" "}what you feel.
            </span>

          </h1>


          <p className="subtitle">

            Select the symptoms you are experiencing.
            Our prediction engine will analyze the pattern.

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



      {/* ====================================================
          CHECKER CARD
      ==================================================== */}

      <section className="checker-card">


        {isAnalyzing ? (

          <AnalysisLoader />

        ) : (

          <>


            {/* ==================================================
                STEP HEADER
            ================================================== */}

            <p className="eyebrow">
              STEP 01 — SYMPTOMS
            </p>


            <h2>
              What symptoms are you experiencing?
            </h2>



            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div className="error-message">

                {error}

              </div>

            )}



            {/* ==================================================
                SEARCH
            ================================================== */}

            <div className="search-box">

              <span>
                ⌕
              </span>


              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Search symptoms..."
              />

            </div>



            {/* ==================================================
                SELECTED SYMPTOMS
            ================================================== */}

            {selectedSymptoms.length > 0 && (

              <div className="selected-section selected-section-top">

                <div className="selected-heading">

                  <span>
                    SELECTED SYMPTOMS
                  </span>


                  <strong>
                    {selectedSymptoms.length}
                  </strong>

                </div>


                <div className="symptom-chips">

                  {selectedSymptoms.map(
                    (symptom) => (

                      <div
                        className="symptom-chip"
                        key={symptom}
                      >

                        {symptom.replaceAll(
                          "_",
                          " "
                        )}


                        <button
                          type="button"
                          onClick={() =>
                            removeSymptom(
                              symptom
                            )
                          }
                        >

                          ×

                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}



            {/* ==================================================
                AVAILABLE SYMPTOMS
            ================================================== */}

            <div className="symptom-list">

              {filteredSymptoms.length === 0 ? (

                <div className="empty-state">

                  No symptoms found.

                </div>

              ) : (

                filteredSymptoms.map(
                  (item) => {

                    const selected =
                      selectedSymptoms.includes(
                        item.name
                      );


                    return (

                      <button
                        type="button"
                        key={item.id}
                        className={`symptom-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          toggleSymptom(
                            item.name
                          )
                        }
                      >

                        <span>

                          {selected
                            ? "✓"
                            : "+"}

                        </span>


                        {item.name.replaceAll(
                          "_",
                          " "
                        )}

                      </button>

                    );

                  }
                )

              )}

            </div>



            {/* ==================================================
                ANALYZE BUTTON
            ================================================== */}

            {selectedSymptoms.length > 0 && (

              <div className="analyze-section">

                <button
                  type="button"
                  className="analyze-button"
                  onClick={analyzeSymptoms}
                >

                  Analyze symptoms

                  <span>
                    →
                  </span>

                </button>

              </div>

            )}

          </>

        )}

      </section>

    </main>

  );

}


export default SymptomChecker;