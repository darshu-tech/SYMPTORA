import { useState } from "react";

import { registerUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";


function Register({
  onLogin,
  onBack
}) {

  const {
    saveSession
  } = useAuth();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");


    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {

      setError(
        "Please complete all fields."
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
        await registerUser(
          name.trim(),
          email.trim(),
          password
        );

      saveSession(
        data.token,
        data.user
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
          NEW ACCOUNT
        </p>

        <h1>
          Create your account.
        </h1>

        <p className="auth-subtitle">
          Build a private workspace for your
          symptom assessments and history.
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
            Full name

            <input
              type="text"
              value={name}
              onChange={event =>
                setName(event.target.value)
              }
              placeholder="Your name"
              autoComplete="name"
            />

          </label>


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


          <div className="auth-two-column">

            <label>
              Password

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
              Confirm password

              <input
                type="password"
                value={confirmPassword}
                onChange={event =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Repeat password"
                autoComplete="new-password"
              />

            </label>

          </div>


          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account →"}
          </button>

        </form>


        <div className="auth-switch">

          Already registered?

          <button
            type="button"
            className="text-button"
            onClick={onLogin}
          >
            Sign in
          </button>

        </div>


        <p className="auth-note">
          Existing anonymous SYMPTORA history is
          attached to the first account created on
          this local installation.
        </p>

      </section>

    </main>

  );

}


export default Register;
