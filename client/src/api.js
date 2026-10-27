
const BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// API Request Function
export async function api(path, options = {}) {
  // Get authentication token from localStorage
  const token = localStorage.getItem("imovies_token");

  let response;

  try {
    // Send request to backend
    response = await fetch(BASE + path, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),

        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to backend. Check that the server and MongoDB are running."
    );
  }

  // Convert response to JSON
  const data = await response
    .json()
    .catch(() => ({}));

  // Handle API errors
  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  // Return backend response
  return data;
}
