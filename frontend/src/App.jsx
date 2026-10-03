import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import SymptomChecker from "./pages/SymptomChecker";
import History from "./pages/History";
import Diseases from "./pages/Diseases";
import Account from "./pages/Account";


function AuthenticatedApp() {

  const [activePage, setActivePage] =
    useState("dashboard");


  return (

    <ProtectedRoute>

      <div className="app">

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />


        {activePage === "dashboard" && (

          <Dashboard
            setActivePage={setActivePage}
          />

        )}


        {activePage === "checker" && (

          <SymptomChecker />

        )}


        {activePage === "history" && (

          <History />

        )}


        {activePage === "diseases" && (

          <Diseases />

        )}


        {activePage === "account" && (

          <Account
            setActivePage={setActivePage}
          />

        )}

      </div>

    </ProtectedRoute>

  );

}


function AppContent() {

  const {
    user,
    isLoading
  } = useAuth();


  const [publicPage, setPublicPage] =
    useState("landing");

  const [resetToken, setResetToken] =
    useState("");


  if (isLoading) {

    return (

      <div className="auth-loading-screen">

        <div className="auth-loading-orbit">
          <span>S</span>
        </div>

        <p>
          Starting SYMPTORA...
        </p>

      </div>

    );

  }


  /*
   * USER IS AUTHENTICATED
   */

  if (user) {

    return (
      <AuthenticatedApp />
    );

  }


  /*
   * LOGIN
   */

  if (publicPage === "login") {

    return (

      <Login
        onRegister={() =>
          setPublicPage("register")
        }

        onForgot={() =>
          setPublicPage("forgot")
        }

        onBack={() =>
          setPublicPage("landing")
        }
      />

    );

  }


  /*
   * REGISTER
   */

  if (publicPage === "register") {

    return (

      <Register
        onLogin={() =>
          setPublicPage("login")
        }

        onBack={() =>
          setPublicPage("landing")
        }
      />

    );

  }


  /*
   * FORGOT PASSWORD
   */

  if (publicPage === "forgot") {

    return (

      <ForgotPassword
        onBack={() =>
          setPublicPage("landing")
        }

        onLogin={() =>
          setPublicPage("login")
        }

        onResetReady={(token) => {

          setResetToken(token);

          setPublicPage("reset");

        }}

      />

    );

  }


  /*
   * RESET PASSWORD
   */

  if (publicPage === "reset") {

    return (

      <ResetPassword
        token={resetToken}

        onLogin={() =>
          setPublicPage("login")
        }

      />

    );

  }


  /*
   * PUBLIC LANDING PAGE
   */

  return (

    <Landing

      onLogin={() =>
        setPublicPage("login")
      }

      onRegister={() =>
        setPublicPage("register")
      }

    />

  );

}


function App() {

  return (

    <AuthProvider>

      <AppContent />

    </AuthProvider>

  );

}


export default App;