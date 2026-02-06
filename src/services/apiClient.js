const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la solicitud.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
