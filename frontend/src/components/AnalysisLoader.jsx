function AnalysisLoader() {
  return (
    <div className="analysis-loader">

      <div className="analysis-orbit">
        <div className="analysis-core">
          +
        </div>
      </div>

      <p className="eyebrow">
        AI ANALYSIS
      </p>

      <h2>
        Analyzing your
        <span> symptoms.</span>
      </h2>

      <p className="analysis-message">
        Comparing your symptom pattern with the
        prediction model.
      </p>

      <div className="analysis-steps">

        <div className="analysis-step active">
          <span>01</span>
          Reading symptoms
        </div>

        <div className="analysis-step active">
          <span>02</span>
          Matching patterns
        </div>

        <div className="analysis-step">
          <span>03</span>
          Generating prediction
        </div>

      </div>

    </div>
  );
}

export default AnalysisLoader;