import { apiClient } from "./apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const MOCK_VISORIAS = [
  {
    id: "v-001",
    nombreEquipo: "Club Deportivo Águilas",
    categorias: ["2008", "2009"],
    rama: "Varonil",
    fecha: "2026-03-15",
    hora: "10:00",
    lugar: "Estadio Municipal",
    direccion: "Av. Deportiva 123, Col. Centro",
    staff: ["Roberto Silva", "Marcos Fuentes"],
    jugadoresCount: 24,
    registroUrl: "http://localhost:5173/registro/v-001",
  },
  {
    id: "v-002",
    nombreEquipo: "Club Deportivo Águilas",
    categorias: ["2010"],
    rama: "Femenil",
    fecha: "2026-03-22",
    hora: "09:00",
    lugar: "Centro Deportivo Norte",
    direccion: "Calle Norte 45, Col. Deportiva",
    staff: ["Ana Martínez"],
    jugadoresCount: 8,
    registroUrl: "http://localhost:5173/registro/v-002",
  },
];

// ─── API ──────────────────────────────────────────────────────────────────────
export const visoriasApi = {
  getAll: () =>
    USE_MOCK
      ? Promise.resolve({ visorias: MOCK_VISORIAS })
      : apiClient.get("/visorias"),

  getById: (id) =>
    USE_MOCK
      ? Promise.resolve({ visoría: MOCK_VISORIAS.find((v) => v.id === id) ?? null })
      : apiClient.get(`/visorias/${id}`),

  create: (data) =>
    USE_MOCK
      ? Promise.resolve({ visoría: { id: `v-${Date.now()}`, ...data, jugadoresCount: 0 } })
      : apiClient.post("/visorias", data),

  delete: (id) =>
    USE_MOCK
      ? Promise.resolve()
      : apiClient.del(`/visorias/${id}`),
};
