import { useState } from "react";

import { useAuth } from "../context/AuthContext";


function Login({
  onRegister,
  onForgot,
  onBack
}) {

  const {
    login
  } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {

      setError(
        "Please enter your email and password."
      );

      return;

    }


    try {

      setIsSubmitting(true);

      await login(
        email.trim(),
        password
      );

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setIsSubmitting(false);

    }

  }


  return (

    <main className="auth-page">

      <div className="auth-background"></div>


      <section className="auth-card">

        <button
          type="button"
          className="auth-back"
          onClick={onBack}
        >
          ← Back
        </button>


        <div className="auth-brand">

          <div className="brand-icon">
            S
          </div>

          <div>
            <strong>SYMPTORA</strong>
            <span>Health Intelligence</span>
          </div>

        </div>


        <p className="eyebrow">
          SECURE ACCESS
        </p>

        <h1>
          Welcome back.
        </h1>

        <p className="auth-subtitle">
          Sign in to continue to your
          personalized symptom intelligence workspace.
        </p>


        {error && (

          <div className="auth-error">
            {error}
          </div>

        )}


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label>
            Email address

            <input
              type="email"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
            />

          </label>


          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </label>


          <div className="auth-form-row">

            <span>
              Protected session
            </span>

            <button
              type="button"
              className="text-button"
              onClick={onForgot}
            >
              Forgot password?
            </button>

          </div>


          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign in →"}
          </button>

        </form>


        <div className="auth-switch">

          New to SYMPTORA?

          <button
            type="button"
            className="text-button"
            onClick={onRegister}
          >
            Create an account
          </button>

        </div>


        <p className="auth-note">
          Your password is securely hashed before
          it is stored.
        </p>

      </section>

    </main>

  );

}


export default Login;
