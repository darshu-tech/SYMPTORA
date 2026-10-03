import { useState } from "react";

import {
  resetPassword
} from "../services/authApi";


function ResetPassword({
  token,
  onLogin
}) {

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!token) {

      setError(
        "The reset token is missing."
      );

      return;

    }


    if (
      password.length < 8
    ) {

      setError(
        "Password must be at least 8 characters."
      );

      return;

    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    try {

      setIsSubmitting(true);

      const data =
        await resetPassword(
          token,
          password
        );

      setSuccess(
        data.message
      );

      setPassword("");
      setConfirmPassword("");

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
          SECURE RESET
        </p>

        <h1>
          Choose a new password.
        </h1>

        <p className="auth-subtitle">
          Your reset token is valid for a limited
          time. Set a new password to continue.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label>
            New password

            <input
              type="password"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />

          </label>


          <label>
            Confirm new password

            <input
              type="password"
              value={confirmPassword}
              onChange={event =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
            />

          </label>


          {!success && (

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Resetting password..."
                : "Reset password →"}
            </button>

          )}

        </form>


        <div className="auth-switch">

          Ready to continue?

          <button
            type="button"
            className="text-button"
            onClick={onLogin}
          >
            Sign in
          </button>

        </div>

      </section>

    </main>

  );

}


export default ResetPassword;
