import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";


function Sidebar({
  activePage,
  setActivePage
}) {

  const {
    user,
    logout
  } = useAuth();


  const [accountOpen, setAccountOpen] =
    useState(false);

  const [logoutConfirmOpen, setLogoutConfirmOpen] =
    useState(false);


  const accountRef = useRef(null);


  /*
   * Close account menu when clicking outside.
   */

  useEffect(() => {

    function handleOutsideClick(event) {

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {

        setAccountOpen(false);

      }

    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /*
   * Open logout confirmation.
   */

  function handleLogoutClick(event) {

    event.stopPropagation();

    setAccountOpen(false);

    setLogoutConfirmOpen(true);

  }


  /*
   * Confirm logout.
   */

  function handleConfirmLogout() {

    setLogoutConfirmOpen(false);

    logout();

  }


  /*
   * Cancel logout.
   */

  function handleCancelLogout() {

    setLogoutConfirmOpen(false);

  }


  /*
   * Open account page.
   */

  function handleAccountClick() {

    setAccountOpen(false);

    setActivePage("account");

  }


  return (

    <>

      <aside className="sidebar">


        {/* =================================================
            BRAND
        ================================================== */}

        <div className="brand">

          <div className="brand-icon">
            S
          </div>

          <div>

            <h2>
              SYMPTORA
            </h2>

            <span>
              Health Intelligence
            </span>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="navigation">


          <button
            type="button"
            className={`nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("dashboard")
            }
          >

            <span>
              ⌂
            </span>

            Dashboard

          </button>


          <button
            type="button"
            className={`nav-item ${
              activePage === "checker"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("checker")
            }
          >

            <span>
              ⌕
            </span>

            Symptom Check

          </button>


          <button
            type="button"
            className={`nav-item ${
              activePage === "history"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("history")
            }
          >

            <span>
              ◷
            </span>

            History

          </button>


          <button
            type="button"
            className={`nav-item ${
              activePage === "diseases"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage("diseases")
            }
          >

            <span>
              ⊙
            </span>

            Diseases

          </button>


        </nav>


        {/* =================================================
            ACCOUNT AREA
        ================================================== */}

        <div
          className="sidebar-account-wrapper"
          ref={accountRef}
        >


          {/* ===============================================
              ACCOUNT BUTTON
          ================================================ */}

          <button
            type="button"
            className={`sidebar-account ${
              accountOpen
                ? "account-open"
                : ""
            }`}
            onClick={() =>
              setAccountOpen(
                (previous) => !previous
              )
            }
          >

            <div className="account-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>


            <div className="account-info">

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.email || ""}
              </span>

            </div>


            <span
              className={`account-chevron ${
                accountOpen
                  ? "account-chevron-open"
                  : ""
              }`}
            >
              ↗
            </span>

          </button>


          {/* ===============================================
              ACCOUNT MENU
          ================================================ */}

          {accountOpen && (

            <div className="account-menu">


              <div className="account-menu-header">

                <div className="account-menu-avatar">

                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>


                <div>

                  <strong>
                    {user?.name || "User"}
                  </strong>

                  <span>
                    {user?.email || ""}
                  </span>

                </div>

              </div>


              <div className="account-menu-divider" />


              {/* =========================================
                  MY ACCOUNT
              ========================================== */}

              <button
                type="button"
                className="account-menu-item"
                onClick={handleAccountClick}
              >

                <span className="account-menu-icon">
                  👤
                </span>


                <div>

                  <strong>
                    My account
                  </strong>

                  <small>
                    View account details
                  </small>

                </div>

              </button>


              {/* =========================================
                  SIGN OUT
              ========================================== */}

              <button
                type="button"
                className="account-menu-item account-menu-danger"
                onClick={handleLogoutClick}
              >

                <span className="account-menu-icon">
                  ↪
                </span>


                <div>

                  <strong>
                    Sign out
                  </strong>

                  <small>
                    End your current session
                  </small>

                </div>

              </button>


            </div>

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================== */}

        <div className="sidebar-footer">

          <span>
            AI ENGINE
          </span>

          <strong>
            ONLINE
          </strong>

        </div>


      </aside>


      {/* ===================================================
          LOGOUT CONFIRMATION MODAL
      ==================================================== */}

      {logoutConfirmOpen && (

        <div
          className="logout-modal-backdrop"
          onClick={handleCancelLogout}
        >


          <div
            className="logout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            <div className="logout-modal-icon">
              ↪
            </div>


            <div className="logout-modal-content">

              <span className="logout-modal-label">
                SECURE SESSION
              </span>


              <h3>
                Sign out of SYMPTORA?
              </h3>


              <p>
                Your current session will be ended.
                You can sign in again at any time.
              </p>

            </div>


            <div className="logout-modal-actions">


              <button
                type="button"
                className="logout-cancel-button"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>


              <button
                type="button"
                className="logout-confirm-button"
                onClick={handleConfirmLogout}
              >
                Sign out →
              </button>


            </div>


          </div>

        </div>

      )}

    </>

  );

}


export default Sidebar;