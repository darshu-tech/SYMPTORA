function Landing({
  onLogin,
  onRegister
}) {

  return (

    <main className="landing-page">

      <div className="landing-grid"></div>

      <header className="landing-nav">

        <div className="landing-brand">

          <div className="brand-icon">
            S
          </div>

          <div>
            <strong>SYMPTORA</strong>
            <span>Health Intelligence</span>
          </div>

        </div>


        <button
          type="button"
          className="landing-login-link"
          onClick={onLogin}
        >
          Sign in →
        </button>

      </header>


      <section className="landing-hero">

        <div className="landing-copy">

          <p className="eyebrow">
            AI HEALTH INTELLIGENCE
          </p>

          <h1>
            Understand your
            <span> symptoms.</span>
          </h1>

          <p className="landing-description">
            SYMPTORA analyzes selected symptom patterns
            using a trained machine-learning model,
            helping you explore possible conditions and
            keep your assessment history organized.
          </p>


          <div className="landing-actions">

            <button
              type="button"
              className="primary-button landing-primary"
              onClick={onRegister}
            >
              Create your account →
            </button>

            <button
              type="button"
              className="secondary-button landing-secondary"
              onClick={onLogin}
            >
              I already have an account
            </button>

          </div>


          <div className="landing-trust">

            <span>
              <i></i>
              132 SYMPTOM FEATURES
            </span>

            <span>
              <i></i>
              41 MODEL CLASSES
            </span>

            <span>
              <i></i>
              RANDOM FOREST
            </span>

          </div>

        </div>


        <div className="landing-visual">

          <div className="landing-orbit orbit-one"></div>
          <div className="landing-orbit orbit-two"></div>

          <div className="landing-core">

            <span>+</span>

          </div>


          <div className="floating-card floating-card-top">

            <span className="status-dot"></span>

            <div>
              <small>AI ENGINE</small>
              <strong>READY</strong>
            </div>

          </div>


          <div className="floating-card floating-card-bottom">

            <small>MODEL OUTPUT</small>

            <strong>TOP 5</strong>

            <span>
              Ranked predictions
            </span>

          </div>

        </div>

      </section>


      <footer className="landing-footer">

        <span>
          SYMPTORA · AI-assisted symptom exploration
        </span>

        <span>
          Not a medical diagnosis
        </span>

      </footer>

    </main>

  );

}


export default Landing;
