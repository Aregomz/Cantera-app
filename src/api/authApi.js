import { apiClient } from "./apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  id: "dt-001",
  nombre: "Carlos Ramírez",
  email: "carlos@cantera.app",
  rol: "dt",
};

const mockLogin = async (email, password) => {
  await new Promise((r) => setTimeout(r, 800)); // simula latencia
  if (email === "dt@cantera.app" && password === "123456") {
    return { token: "mock-token-xyz", user: MOCK_USER };
  }
  throw new Error("Credenciales incorrectas.");
};

const mockGetMe = async () => {
  await new Promise((r) => setTimeout(r, 300));
  return { user: MOCK_USER };
};

// ─── API real ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    USE_MOCK
      ? mockLogin(email, password)
      : apiClient.post("/auth/login", { email, password }),

  getMe: () =>
    USE_MOCK
      ? mockGetMe()
      : apiClient.get("/auth/me"),

  logout: () =>
    USE_MOCK
      ? Promise.resolve()
      : apiClient.post("/auth/logout"),
};
