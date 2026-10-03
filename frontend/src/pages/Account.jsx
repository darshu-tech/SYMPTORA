import { useAuth } from "../context/AuthContext";

function Account({ setActivePage }) {
  const { user } = useAuth();

  const displayName = user?.name || "User";
  const email = user?.email || "No email available";

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <main className="main-content account-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="account-page-header">

        <div className="account-header-content">

          <span className="eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>
            Your account <span>details.</span>
          </h1>

          <p>
            Manage your SYMPTORA profile and review
            your current account information.
          </p>

        </div>

        <div className="account-status-pill">
          <span className="account-status-dot"></span>
          ACCOUNT ACTIVE
        </div>

      </div>


      {/* =====================================================
          PROFILE + SECURITY
      ====================================================== */}

      <section className="account-grid">


        {/* ===================================================
            PROFILE CARD
        ==================================================== */}

        <div className="account-panel profile-panel">

          <div className="account-panel-label">
            PROFILE
          </div>


          <div className="account-profile">

            <div className="account-large-avatar">
              {initial}
            </div>

            <div className="account-profile-info">

              <h2>
                {displayName}
              </h2>

              <p>
                {email}
              </p>

            </div>

          </div>


          <div className="account-line"></div>


          <div className="account-details">

            <div className="account-detail-row">

              <span>
                FULL NAME
              </span>

              <strong>
                {displayName}
              </strong>

            </div>


            <div className="account-detail-row">

              <span>
                EMAIL ADDRESS
              </span>

              <strong className="account-email-value">
                {email}
              </strong>

            </div>


            <div className="account-detail-row">

              <span>
                ACCOUNT STATUS
              </span>

              <strong className="account-active-text">
                <span className="mini-status-dot"></span>
                Active
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================================
            SECURITY CARD
        ==================================================== */}

        <div className="account-panel security-panel">

          <div className="account-panel-label">
            SECURITY
          </div>


          <div className="security-item">

            <div className="security-icon">
              ✓
            </div>

            <div className="security-content">

              <h3>
                Protected account
              </h3>

              <p>
                Your account is protected by the
                SYMPTORA authentication system.
              </p>

            </div>

          </div>


          <div className="security-item">

            <div className="security-icon">
              ●
            </div>

            <div className="security-content">

              <h3>
                Secure session
              </h3>

              <p>
                Your current session is authenticated
                and protected.
              </p>

            </div>

          </div>


          <div className="security-item">

            <div className="security-icon">
              S
            </div>

            <div className="security-content">

              <h3>
                Password protected
              </h3>

              <p>
                Your password is securely handled by
                the backend authentication system.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SESSION CARD
      ====================================================== */}

      <section className="account-panel session-panel">

        <div className="session-content">

          <div className="account-panel-label">
            SESSION
          </div>

          <h2>
            Current SYMPTORA session
          </h2>

          <p>
            You are currently signed in and can access
            your symptom analysis, assessment history,
            and disease intelligence.
          </p>

        </div>


        <button
          type="button"
          className="account-back-button"
          onClick={() =>
            setActivePage("dashboard")
          }
        >
          ← Back to dashboard
        </button>

      </section>


      {/* =====================================================
          ACCOUNT PAGE STYLES
      ====================================================== */}

      <style>{`

        /* =================================================
           PAGE
        ================================================= */

        .account-page {
          min-height: 100vh;
          padding: 48px 56px 70px;
          box-sizing: border-box;
        }


        /* =================================================
           HEADER
        ================================================= */

        .account-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 42px;
        }


        .account-header-content {
          max-width: 760px;
        }


        .account-header-content .eyebrow {
          display: block;
          margin-bottom: 16px;
        }


        .account-header-content h1 {
          margin: 0;
          font-size: clamp(42px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -2.5px;
          font-weight: 700;
          color: #f2fbf8;
        }


        .account-header-content h1 span {
          color: #20d6ad;
        }


        .account-header-content p {
          margin: 20px 0 0;
          max-width: 680px;
          color: #78aaa1;
          font-size: 17px;
          line-height: 1.7;
        }


        /* =================================================
           STATUS
        ================================================= */

        .account-status-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;

          padding: 12px 17px;

          border: 1px solid rgba(32, 214, 173, 0.18);
          border-radius: 999px;

          background:
            rgba(7, 36, 31, 0.75);

          color: #8dbab2;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;

          white-space: nowrap;
        }


        .account-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #20d6ad;

          box-shadow:
            0 0 12px rgba(32, 214, 173, 0.9);
        }


        /* =================================================
           GRID
        ================================================= */

        .account-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(0, 0.85fr);

          gap: 22px;
          align-items: stretch;
        }


        /* =================================================
           COMMON PANEL
        ================================================= */

        .account-panel {
          position: relative;

          border: 1px solid
            rgba(32, 214, 173, 0.14);

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              rgba(11, 48, 41, 0.88),
              rgba(5, 27, 24, 0.92)
            );

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.025),
            0 18px 50px rgba(0,0,0,0.08);

          box-sizing: border-box;
        }


        .account-panel-label {
          color: #51b6a4;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;

          margin-bottom: 25px;
        }


        /* =================================================
           PROFILE
        ================================================= */

        .profile-panel {
          padding: 32px;
        }


        .account-profile {
          display: flex;
          align-items: center;
          gap: 19px;
        }


        .account-large-avatar {
          width: 68px;
          height: 68px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              #22d9b1,
              #0e987d
            );

          color: #03231d;

          font-size: 26px;
          font-weight: 800;

          box-shadow:
            0 10px 28px
            rgba(32, 214, 173, 0.18);
        }


        .account-profile-info h2 {
          margin: 0;

          color: #f1faf7;

          font-size: 25px;
          line-height: 1.2;
        }


        .account-profile-info p {
          margin: 7px 0 0;

          color: #679c92;

          font-size: 14px;

          word-break: break-word;
        }


        .account-line {
          height: 1px;

          margin: 29px 0 8px;

          background:
            rgba(32, 214, 173, 0.11);
        }


        .account-details {
          display: flex;
          flex-direction: column;
        }


        .account-detail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;

          padding: 18px 0;

          border-bottom:
            1px solid rgba(32, 214, 173, 0.08);
        }


        .account-detail-row:last-child {
          border-bottom: none;
          padding-bottom: 4px;
        }


        .account-detail-row span:first-child {
          color: #4f958a;

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
        }


        .account-detail-row strong {
          color: #e6f4f0;

          font-size: 14px;
          font-weight: 600;

          text-align: right;

          word-break: break-word;
        }


        .account-email-value {
          max-width: 260px;
        }


        .account-active-text {
          display: flex;
          align-items: center;
          gap: 8px;

          color: #20d6ad !important;
        }


        .mini-status-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #20d6ad;

          box-shadow:
            0 0 9px rgba(32, 214, 173, 0.8);
        }


        /* =================================================
           SECURITY
        ================================================= */

        .security-panel {
          padding: 32px;
        }


        .security-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;

          padding: 18px 0;

          border-bottom:
            1px solid rgba(32, 214, 173, 0.08);
        }


        .security-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }


        .security-icon {
          width: 38px;
          height: 38px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background:
            rgba(32, 214, 173, 0.08);

          border:
            1px solid rgba(32, 214, 173, 0.16);

          color: #20d6ad;

          font-size: 15px;
          font-weight: 700;
        }


        .security-content h3 {
          margin: 2px 0 6px;

          color: #eaf7f4;

          font-size: 16px;
          font-weight: 650;
        }


        .security-content p {
          margin: 0;

          color: #679c92;

          font-size: 13px;
          line-height: 1.6;
        }


        /* =================================================
           SESSION
        ================================================= */

        .session-panel {
          margin-top: 22px;

          padding: 30px 32px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 30px;
        }


        .session-content {
          max-width: 760px;
        }


        .session-content .account-panel-label {
          margin-bottom: 12px;
        }


        .session-content h2 {
          margin: 0;

          color: #edf8f5;

          font-size: 25px;
        }


        .session-content p {
          margin: 10px 0 0;

          color: #679c92;

          font-size: 14px;
          line-height: 1.7;
        }


        /* =================================================
           BACK BUTTON
        ================================================= */

        .account-back-button {
          flex-shrink: 0;

          padding: 13px 18px;

          border:
            1px solid rgba(32, 214, 173, 0.22);

          border-radius: 12px;

          background:
            rgba(32, 214, 173, 0.06);

          color: #20d6ad;

          font-family: inherit;

          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }


        .account-back-button:hover {
          background:
            rgba(32, 214, 173, 0.12);

          border-color:
            rgba(32, 214, 173, 0.4);

          transform: translateY(-1px);
        }


        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1000px) {

          .account-page {
            padding: 35px 30px 55px;
          }

          .account-grid {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 700px) {

          .account-page {
            padding: 28px 20px 45px;
          }

          .account-page-header {
            flex-direction: column;
          }

          .account-header-content h1 {
            font-size: 42px;
            letter-spacing: -1.5px;
          }

          .account-header-content p {
            font-size: 15px;
          }

          .profile-panel,
          .security-panel {
            padding: 24px;
          }

          .account-detail-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .account-detail-row strong {
            text-align: left;
          }

          .account-email-value {
            max-width: 100%;
          }

          .session-panel {
            flex-direction: column;
            align-items: flex-start;
            padding: 25px;
          }

          .account-back-button {
            width: 100%;
          }

        }

      `}</style>

    </main>
  );
}

export default Account;