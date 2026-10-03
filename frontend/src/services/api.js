const API_URL = "http://127.0.0.1:5000/api";


function getAuthHeaders() {

  const token =
    localStorage.getItem(
      "symptora_token"
    );

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

}


async function parseApiResponse(
  response,
  fallbackMessage
) {

  const data =
    await response.json().catch(
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
// GET SYMPTOMS
// ============================================================

export async function getSymptoms() {

  const response = await fetch(
    `${API_URL}/symptoms`
  );

  return parseApiResponse(
    response,
    "Failed to load symptoms."
  );

}


// ============================================================
// PREDICT DISEASE
// ============================================================

export async function predictDisease(
  symptoms
) {

  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },

      body: JSON.stringify({
        symptoms,
      }),
    }
  );

  return parseApiResponse(
    response,
    "Prediction request failed."
  );

}


// ============================================================
// GET ASSESSMENT HISTORY
// ============================================================

export async function getHistory() {

  const response = await fetch(
    `${API_URL}/history`,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return parseApiResponse(
    response,
    "Failed to load history."
  );

}


// ============================================================
// DELETE ASSESSMENT
// ============================================================

export async function deleteHistory(
  assessmentId
) {

  const response = await fetch(
    `${API_URL}/history/${assessmentId}`,
    {
      method: "DELETE",

      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  return parseApiResponse(
    response,
    "Failed to delete assessment."
  );

}


// ============================================================
// UPDATE ASSESSMENT
// ============================================================

export async function updateHistory(
  assessmentId,
  symptoms
) {

  const response = await fetch(
    `${API_URL}/history/${assessmentId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },

      body: JSON.stringify({
        symptoms,
      }),
    }
  );

  return parseApiResponse(
    response,
    "Failed to update assessment."
  );

}


// ============================================================
// GET DISEASES
// ============================================================

export async function getDiseases() {

  const response = await fetch(
    `${API_URL}/diseases`
  );

  return parseApiResponse(
    response,
    "Failed to load diseases."
  );

}


// ============================================================
// GET DISEASE DETAILS
// ============================================================

export async function getDiseaseDetails() {

  const response = await fetch(
    `${API_URL}/diseases/details`
  );

  return parseApiResponse(
    response,
    "Failed to load disease details."
  );

}
