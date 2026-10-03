import { useState } from "react";

import {
  requestPasswordReset
} from "../services/authApi";


function ForgotPassword({
  onBack,
  onResetReady,
  onLogin
}) {

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  async function handleSubmit(event) {

    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {

      setError(
        "Please enter your registered email."
      );

      return;

    }


    try {

      setIsSubmitting(true);

      const data =
        await requestPasswordReset(
          email.trim()
        );

      if (data.demo_reset_token) {

        onResetReady(
          data.demo_reset_token
        );

        return;

      }

      setMessage(
        data.message
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
          ACCOUNT RECOVERY
        </p>

        <h1>
          Reset your password.
        </h1>

        <p className="auth-subtitle">
          Enter your account email to start the
          secure password recovery process.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {message && (
          <div className="auth-success">
            {message}
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


          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating reset request..."
              : "Continue →"}
          </button>

        </form>


        <div className="auth-switch">

          Remembered your password?

          <button
            type="button"
            className="text-button"
            onClick={onLogin}
          >
            Back to login
          </button>

        </div>


        <p className="auth-note">
          Local demo mode displays the reset token
          directly. A production deployment would
          deliver it through a verified email.
        </p>

      </section>

    </main>

  );

}


export default ForgotPassword;
