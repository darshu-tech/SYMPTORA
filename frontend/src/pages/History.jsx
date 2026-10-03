import { useEffect, useState } from "react";

import {
  getHistory,
  getSymptoms,
  updateHistory,
  deleteHistory
} from "../services/api";


function History() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [assessments, setAssessments] = useState([]);

  const [symptoms, setSymptoms] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingAssessment, setEditingAssessment] =
    useState(null);

  const [editSymptoms, setEditSymptoms] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);


  // ==========================================================
  // LOAD HISTORY
  // ==========================================================

  useEffect(() => {

    loadHistory();

  }, []);


  // ==========================================================
  // LOAD HISTORY DATA
  // ==========================================================

  const loadHistory = async () => {

    try {

      setIsLoading(true);

      setError("");

      const data = await getHistory();

      setAssessments(
        data.assessments || []
      );

    } catch (error) {

      console.error(
        "History loading error:",
        error
      );

      setError(
        "Unable to load assessment history."
      );

    } finally {

      setIsLoading(false);

    }

  };


  // ==========================================================
  // LOAD SYMPTOMS FOR EDITING
  // ==========================================================

  const loadSymptoms = async () => {

    try {

      const data = await getSymptoms();

      setSymptoms(
        data.symptoms || []
      );

    } catch (error) {

      console.error(
        "Symptom loading error:",
        error
      );

    }

  };


  // ==========================================================
  // START EDIT
  // ==========================================================

  const startEdit = async (assessment) => {

    setError("");

    setEditingAssessment(
      assessment
    );

    setEditSymptoms(
      [...assessment.symptoms]
    );

    setSearchTerm("");

    if (symptoms.length === 0) {

      await loadSymptoms();

    }

  };


  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  const cancelEdit = () => {

    setEditingAssessment(null);

    setEditSymptoms([]);

    setSearchTerm("");

    setError("");

  };


  // ==========================================================
  // TOGGLE EDIT SYMPTOM
  // ==========================================================

  const toggleEditSymptom = (symptom) => {

    setError("");

    if (
      editSymptoms.includes(symptom)
    ) {

      setEditSymptoms(
        editSymptoms.filter(
          item => item !== symptom
        )
      );

    } else {

      setEditSymptoms([
        ...editSymptoms,
        symptom
      ]);

    }

  };


  // ==========================================================
  // REMOVE EDIT SYMPTOM
  // ==========================================================

  const removeEditSymptom = (symptom) => {

    setEditSymptoms(
      editSymptoms.filter(
        item => item !== symptom
      )
    );

  };


  // ==========================================================
  // SAVE EDIT
  // ==========================================================

  const saveEdit = async () => {

    if (
      editSymptoms.length === 0
    ) {

      setError(
        "Please select at least one symptom."
      );

      return;

    }


    try {

      setIsUpdating(true);

      setError("");


      await updateHistory(
        editingAssessment.id,
        editSymptoms
      );


      await loadHistory();


      setEditingAssessment(null);

      setEditSymptoms([]);

      setSearchTerm("");


    } catch (error) {

      console.error(
        "Update history error:",
        error
      );

      setError(
        "Unable to update this assessment."
      );

    } finally {

      setIsUpdating(false);

    }

  };


  // ==========================================================
  // DELETE ASSESSMENT
  // ==========================================================

  const handleDelete = async (
    assessmentId
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this assessment?"
    );


    if (!confirmed) {

      return;

    }


    try {

      setError("");

      await deleteHistory(
        assessmentId
      );

      await loadHistory();

    } catch (error) {

      console.error(
        "Delete history error:",
        error
      );

      setError(
        "Unable to delete this assessment."
      );

    }

  };


  // ==========================================================
  // FORMAT SYMPTOM
  // ==========================================================

  const formatSymptom = (
    symptom
  ) => {

    return symptom
      .replaceAll("_", " ")
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

  };


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    dateString
  ) => {

    if (!dateString) {

      return "Unknown date";

    }


    const date =
      new Date(dateString);


    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  };


  // ==========================================================
  // FILTER EDIT SYMPTOMS
  // ==========================================================

  const filteredEditSymptoms =
    symptoms.filter(
      item =>
        item.name
          .replaceAll("_", " ")
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {

    return (

      <main className="dashboard">

        <div className="top-bar">

          <div>

            <p className="eyebrow">
              ASSESSMENT HISTORY
            </p>

            <h1>
              Your symptom
              <span> history.</span>
            </h1>

            <p className="subtitle">
              Loading your previous assessments...
            </p>

          </div>

        </div>


        <section className="history-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading assessment records...
          </p>

        </section>

      </main>

    );

  }


  // ==========================================================
  // MAIN HISTORY PAGE
  // ==========================================================

  return (

    <main className="dashboard">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="top-bar">

        <div>

          <p className="eyebrow">
            ASSESSMENT HISTORY
          </p>


          <h1>

            Your symptom

            <span>
              {" "}history.
            </span>

          </h1>


          <p className="subtitle">

            Review previous symptom analyses,
            model outputs, and assessment details.

          </p>

        </div>


        <div className="status-card">

          <span className="status-dot"></span>

          RECORDS

          <strong>
            {assessments.length}
          </strong>

        </div>

      </div>



      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}



      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {assessments.length === 0 ? (

        <section className="history-empty">

          <div className="empty-icon">
            +
          </div>


          <p className="eyebrow">
            NO ASSESSMENTS
          </p>


          <h2>
            Your history is empty.
          </h2>


          <p>
            Complete a symptom analysis and
            your assessment will appear here.
          </p>

        </section>

      ) : (


        /* ====================================================
           HISTORY LIST
        ==================================================== */

        <section className="history-list">

          {assessments.map(
            (assessment, index) => {

              const predictions =
                assessment.predictions || [];


              return (

                <article
                  className="history-card"
                  key={assessment.id}
                >


                  {/* ==========================================
                      CARD HEADER
                  ========================================== */}

                  <div className="history-card-header">

                    <div>

                      <p className="eyebrow">
                        ASSESSMENT #
                        {assessment.id}
                      </p>


                      <h2>
                        {assessment.prediction}
                      </h2>

                    </div>


                    <div className="history-score">

                      <span>
                        MODEL SCORE
                      </span>


                      <strong>
                        {assessment.confidence}%
                      </strong>

                    </div>

                  </div>



                  {/* ==========================================
                      DATE
                  ========================================== */}

                  <div className="history-date">

                    <span className="status-dot"></span>

                    {formatDate(
                      assessment.created_at
                    )}

                  </div>



                  {/* ==========================================
                      ANALYZED SYMPTOMS
                  ========================================== */}

                  <div className="history-section">

                    <div className="history-section-heading">

                      <span>
                        ANALYZED SYMPTOMS
                      </span>


                      <strong>
                        {assessment.symptoms.length}
                      </strong>

                    </div>


                    <div className="symptom-chips">

                      {assessment.symptoms.map(
                        symptom => (

                          <span
                            className="symptom-chip"
                            key={symptom}
                          >

                            {formatSymptom(
                              symptom
                            )}

                          </span>

                        )
                      )}

                    </div>

                  </div>



                  {/* ==========================================
                      TOP 5 MODEL OUTPUT
                  ========================================== */}

                  <div className="history-section">

                    <div className="history-section-heading">

                      <span>
                        MODEL OUTPUT
                      </span>


                      <strong>
                        {predictions.length > 0
                          ? predictions.length
                          : "—"}
                      </strong>

                    </div>


                    {predictions.length > 0 ? (

                      <div className="history-predictions">

                        {predictions.map(
                          (item, predictionIndex) => (

                            <div
                              className="history-prediction"
                              key={item.disease}
                            >


                              <div className="prediction-info">

                                <span className="prediction-rank">

                                  {String(
                                    predictionIndex + 1
                                  ).padStart(2, "0")}

                                </span>


                                <strong>
                                  {item.disease}
                                </strong>

                              </div>


                              <div className="prediction-value">

                                <strong>
                                  {item.probability}%
                                </strong>

                                <div className="prediction-bar">

                                  <span
                                    style={{
                                      width: `${Math.min(
                                        item.probability,
                                        100
                                      )}%`
                                    }}
                                  ></span>

                                </div>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="legacy-output">

                        <span>
                          MODEL OUTPUT
                        </span>

                        <p>

                          Top prediction:

                          <strong>
                            {" "}
                            {assessment.prediction}
                          </strong>

                          {" "}at{" "}

                          <strong>
                            {assessment.confidence}%
                          </strong>

                        </p>

                        <small>
                          Detailed ranked predictions were
                          not stored for this older assessment.
                        </small>

                      </div>

                    )}

                  </div>



                  {/* ==========================================
                      CARD FOOTER
                  ========================================== */}

                  <div className="history-card-footer">

                    <div className="history-meta">

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
                          132
                        </strong>

                      </div>


                      <div>

                        <span>
                          OUTPUT
                        </span>

                        <strong>
                          {predictions.length > 0
                            ? "TOP 5"
                            : "PRIMARY"}
                        </strong>

                      </div>

                    </div>


                    <div className="history-actions">

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          startEdit(
                            assessment
                          )
                        }
                      >

                        Edit assessment

                      </button>


                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          handleDelete(
                            assessment.id
                          )
                        }
                      >

                        Delete

                      </button>

                    </div>

                  </div>


                </article>

              );

            }
          )}

        </section>

      )}



      {/* ======================================================
          EDIT PANEL
      ====================================================== */}

      {editingAssessment && (

        <div className="edit-overlay">

          <section className="edit-panel">


            {/* ================================================
                EDIT HEADER
            ================================================ */}

            <div className="edit-panel-header">

              <div>

                <p className="eyebrow">
                  EDIT ASSESSMENT #
                  {editingAssessment.id}
                </p>


                <h2>
                  Update symptoms
                </h2>


                <p>
                  Select the symptoms again.
                  SYMPTORA will run the AI model
                  again and update this record.
                </p>

              </div>


              <button
                type="button"
                className="close-button"
                onClick={cancelEdit}
              >
                ×
              </button>

            </div>



            {/* ================================================
                CURRENT SELECTION
            ================================================ */}

            <div className="edit-selected">

              <div className="history-section-heading">

                <span>
                  SELECTED SYMPTOMS
                </span>


                <strong>
                  {editSymptoms.length}
                </strong>

              </div>


              <div className="symptom-chips">

                {editSymptoms.map(
                  symptom => (

                    <div
                      className="symptom-chip"
                      key={symptom}
                    >

                      {formatSymptom(
                        symptom
                      )}


                      <button
                        type="button"
                        onClick={() =>
                          removeEditSymptom(
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



            {/* ================================================
                SEARCH
            ================================================ */}

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



            {/* ================================================
                SYMPTOM OPTIONS
            ================================================ */}

            <div className="edit-symptom-list">

              {filteredEditSymptoms.map(
                item => {

                  const selected =
                    editSymptoms.includes(
                      item.name
                    );


                  return (

                    <button
                      type="button"
                      key={item.id}
                      className={
                        `symptom-option ${
                          selected
                            ? "selected"
                            : ""
                        }`
                      }
                      onClick={() =>
                        toggleEditSymptom(
                          item.name
                        )
                      }
                    >

                      <span>

                        {selected
                          ? "✓"
                          : "+"}

                      </span>


                      {formatSymptom(
                        item.name
                      )}

                    </button>

                  );

                }
              )}

            </div>



            {/* ================================================
                EDIT ACTIONS
            ================================================ */}

            <div className="edit-panel-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={cancelEdit}
                disabled={isUpdating}
              >

                Cancel

              </button>


              <button
                type="button"
                className="primary-button"
                onClick={saveEdit}
                disabled={isUpdating}
              >

                {isUpdating
                  ? "Analyzing..."
                  : "Update assessment →"}

              </button>

            </div>


          </section>

        </div>

      )}

    </main>

  );

}


export default History;