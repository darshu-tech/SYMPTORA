import { useEffect, useState } from "react";

import {
  getDiseaseDetails
} from "../services/api";


// ============================================================
// FORMAT SYMPTOM NAME
// ============================================================

function formatSymptomName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}


// ============================================================
// DISEASES PAGE
// ============================================================

function Diseases() {

  const [diseases, setDiseases] = useState([]);

  const [selectedDisease, setSelectedDisease] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD DISEASE DETAILS
  // ==========================================================

  useEffect(() => {

    async function loadDiseaseDetails() {

      try {

        const data =
          await getDiseaseDetails();

        if (!data.success) {

          throw new Error(
            data.error ||
            "Unable to load disease information."
          );

        }

        setDiseases(
          data.diseases
        );

      } catch (error) {

        console.error(
          "Disease details error:",
          error
        );

        setError(
          "Unable to load disease information."
        );

      } finally {

        setIsLoading(false);

      }

    }

    loadDiseaseDetails();

  }, []);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredDiseases =
    diseases.filter(
      disease =>
        disease.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (isLoading) {

    return (

      <main className="dashboard">

        <div className="page-header">

          <div>

            <p className="eyebrow">
              DISEASE INTELLIGENCE
            </p>

            <h1>
              Loading
              <span> disease library.</span>
            </h1>

            <p className="page-description">
              Connecting to the SYMPTORA
              intelligence engine...
            </p>

          </div>

        </div>


        <section className="disease-loading">

          <div className="loading-orbit">
            +
          </div>

          <p>
            Loading model-supported
            conditions
          </p>

        </section>

      </main>

    );

  }


  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {

    return (

      <main className="dashboard">

        <div className="page-header">

          <div>

            <p className="eyebrow">
              DISEASE INTELLIGENCE
            </p>

            <h1>
              Disease
              <span> library.</span>
            </h1>

          </div>

        </div>


        <section className="disease-error">

          <div className="error-icon">
            !
          </div>

          <h2>
            Unable to load disease data
          </h2>

          <p>
            {error}
          </p>

        </section>

      </main>

    );

  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (

    <main className="dashboard">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            DISEASE INTELLIGENCE
          </p>


          <h1>
            Explore possible
            <span> conditions.</span>
          </h1>


          <p className="page-description">
            Browse the conditions recognized by
            SYMPTORA and explore the symptom
            patterns learned from its training
            dataset.
          </p>

        </div>


        <div className="header-status">

          <span className="status-dot"></span>

          {diseases.length} CONDITIONS

        </div>

      </div>


      {/* ======================================================
          SEARCH
      ====================================================== */}

      <section className="disease-library">

        <div className="disease-search">

          <span className="search-symbol">
            ⌕
          </span>


          <input
            type="text"
            value={searchTerm}
            onChange={event =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search conditions..."
          />


          <span className="search-count">
            {filteredDiseases.length}
          </span>

        </div>


        {/* ====================================================
            DISEASE GRID
        ==================================================== */}

        <div className="disease-grid">

          {filteredDiseases.map(
            (disease, index) => (

              <button
                className="disease-card disease-card-button"
                key={disease.name}
                onClick={() =>
                  setSelectedDisease(disease)
                }
              >


                {/* ==========================================
                    CARD TOP
                ========================================== */}

                <div className="disease-card-top">

                  <div className="disease-number">

                    {String(index + 1)
                      .padStart(2, "0")}

                  </div>


                  <div className="disease-arrow">
                    →
                  </div>

                </div>


                {/* ==========================================
                    DISEASE NAME
                ========================================== */}

                <div className="disease-content">

                  <p className="eyebrow">
                    AI CONDITION
                  </p>


                  <h2>
                    {disease.name.trim()}
                  </h2>

                </div>


                {/* ==========================================
                    DATASET INFORMATION
                ========================================== */}

                <div className="disease-card-metrics">

                  <div className="disease-metric">

                    <span className="metric-label">
                      TRAINING RECORDS
                    </span>

                    <strong>
                      {disease.training_records}
                    </strong>

                  </div>


                  <div className="disease-metric">

                    <span className="metric-label">
                      SYMPTOM PATTERNS
                    </span>

                    <strong>
                      {disease.symptoms.length}
                    </strong>

                  </div>

                </div>


                {/* ==========================================
                    TOP DATASET SIGNALS
                ========================================== */}

                <div className="disease-signals">

                  <p className="disease-signals-title">
                    TOP DATASET SIGNALS
                  </p>


                  <div className="disease-signal-list">

                    {disease.symptoms
                      .slice(0, 3)
                      .map((symptom) => (

                        <span
                          className="disease-signal"
                          key={symptom.name}
                        >

                          {formatSymptomName(
                            symptom.name
                          )}

                        </span>

                      ))}

                  </div>

                </div>


                {/* ==========================================
                    CARD FOOTER
                ========================================== */}

                <div className="disease-card-footer">

                  <span className="view-intelligence">
                    VIEW INTELLIGENCE →
                  </span>


                  <div className="disease-status">

                    <span className="status-dot"></span>

                    MODEL SUPPORTED

                  </div>

                </div>


              </button>

            )
          )}

        </div>


        {/* ====================================================
            EMPTY SEARCH
        ==================================================== */}

        {filteredDiseases.length === 0 && (

          <div className="disease-empty">

            <div className="empty-icon">
              ?
            </div>


            <h2>
              No condition found
            </h2>


            <p>
              Try another disease name.
            </p>

          </div>

        )}

      </section>


      {/* ======================================================
          DISEASE DETAIL MODAL
      ====================================================== */}

      {selectedDisease && (

        <div
          className="disease-modal-backdrop"
          onClick={() =>
            setSelectedDisease(null)
          }
        >

          <section
            className="disease-modal"
            onClick={event =>
              event.stopPropagation()
            }
          >


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="disease-modal-header">

              <div>

                <p className="eyebrow">
                  CONDITION INTELLIGENCE
                </p>


                <h2>
                  {selectedDisease.name.trim()}
                </h2>


                <p className="disease-modal-subtitle">
                  Dataset-derived symptom pattern
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedDisease(null)
                }
              >
                ×
              </button>

            </div>


            {/* =================================================
                DATASET SUMMARY
            ================================================= */}

            <div className="disease-summary-grid">


              <div className="disease-summary-card">

                <span>
                  TRAINING RECORDS
                </span>

                <strong>
                  {selectedDisease.training_records}
                </strong>

              </div>


              <div className="disease-summary-card">

                <span>
                  SYMPTOM PATTERNS
                </span>

                <strong>
                  {selectedDisease.symptoms.length}
                </strong>

              </div>


              <div className="disease-summary-card">

                <span>
                  ENGINE
                </span>

                <strong>
                  RANDOM FOREST
                </strong>

              </div>

            </div>


            {/* =================================================
                SYMPTOM PATTERN
            ================================================= */}

            <div className="disease-detail-section">

              <div className="detail-section-header">

                <div>

                  <p className="eyebrow">
                    DATASET SIGNALS
                  </p>


                  <h3>
                    Associated symptom patterns
                  </h3>

                </div>


                <span className="detail-count">
                  {selectedDisease.symptoms.length}
                </span>

              </div>


              <div className="symptom-frequency-list">

                {selectedDisease.symptoms.map(
                  (symptom, index) => {

                    const frequencyPercent =
                      (
                        symptom.frequency /
                        selectedDisease.training_records
                      ) * 100;


                    return (

                      <div
                        className="frequency-row"
                        key={symptom.name}
                      >

                        <div className="frequency-info">

                          <span className="frequency-number">

                            {String(index + 1)
                              .padStart(2, "0")}

                          </span>


                          <span className="frequency-name">

                            {formatSymptomName(
                              symptom.name
                            )}

                          </span>


                          <span className="frequency-value">

                            {symptom.frequency}
                            /
                            {selectedDisease.training_records}

                          </span>

                        </div>


                        <div className="frequency-track">

                          <div
                            className="frequency-fill"
                            style={{
                              width: `${frequencyPercent}%`
                            }}
                          />

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            </div>


            {/* =================================================
                DISCLAIMER
            ================================================= */}

            <div className="disease-data-note">

              <span className="note-icon">
                i
              </span>


              <p>
                These symptom frequencies are
                derived from the SYMPTORA training
                dataset. They describe patterns
                represented in the dataset and are
                not clinical guidance or diagnostic
                information.
              </p>

            </div>


            {/* =================================================
                CLOSE
            ================================================= */}

            <div className="disease-modal-footer">

              <button
                className="modal-primary-button"
                onClick={() =>
                  setSelectedDisease(null)
                }
              >
                Close intelligence view →
              </button>

            </div>


          </section>

        </div>

      )}

    </main>

  );

}


export default Diseases;