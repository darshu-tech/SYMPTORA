const API_URL = "http://127.0.0.1:5000/api/auth";


async function parseResponse(response, fallbackMessage) {

  const data = await response.json().catch(
    () => ({})
  );

  if (!response.ok) {

    throw new Error(
      data.error || fallbackMessage
    );

  }

  return data;
}


// ============================================================
// REGISTER
// ============================================================

export async function registerUser(
  name,
  email,
  password
) {

  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  return parseResponse(
    response,
    "Unable to create your account."
  );
}


// ============================================================
// LOGIN
// ============================================================

export async function loginUser(
  email,
  password
) {

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return parseResponse(
    response,
    "Unable to log in."
  );
}


// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser(
  token
) {

  const response = await fetch(
    `${API_URL}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return parseResponse(
    response,
    "Session expired."
  );
}


// ============================================================
// FORGOT PASSWORD
// ============================================================

export async function requestPasswordReset(
  email
) {

  const response = await fetch(
    `${API_URL}/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
      }),
    }
  );

  return parseResponse(
    response,
    "Unable to create the reset request."
  );
}


// ============================================================
// RESET PASSWORD
// ============================================================

export async function resetPassword(
  token,
  password
) {

  const response = await fetch(
    `${API_URL}/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
        password,
      }),
    }
  );

  return parseResponse(
    response,
    "Unable to reset your password."
  );
}
