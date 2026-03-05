import { apiClient } from "./apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Mock data ────────────────────────────────────────────────────────────────
export const MOCK_JUGADORES = [
  { id: "j-001", nombreCompleto: "Andrés López García",   fechaNacimiento: "2008-03-12", genero: "Masculino", posicionPrincipal: "Delantero centro",    posicionSecundaria: "Media punta",          piernaHabil: "Derecha",    altura: 175, asistio: true  },
  { id: "j-002", nombreCompleto: "Marco Torres Ríos",     fechaNacimiento: "2009-07-25", genero: "Masculino", posicionPrincipal: "Interior",             posicionSecundaria: null,                   piernaHabil: "Derecha",    altura: 169, asistio: true  },
  { id: "j-003", nombreCompleto: "Luis Herrera Vega",     fechaNacimiento: "2008-11-04", genero: "Masculino", posicionPrincipal: "Defensa central",       posicionSecundaria: "Lateral derecho",      piernaHabil: "Derecha",    altura: 181, asistio: false },
  { id: "j-004", nombreCompleto: "Carlos Mendoza Ruiz",   fechaNacimiento: "2009-02-18", genero: "Masculino", posicionPrincipal: "Portero",               posicionSecundaria: null,                   piernaHabil: "Derecha",    altura: 183, asistio: true  },
  { id: "j-005", nombreCompleto: "Diego Sánchez Mora",    fechaNacimiento: "2008-06-30", genero: "Masculino", posicionPrincipal: "Lateral izquierdo",     posicionSecundaria: "Volante por izquierda", piernaHabil: "Izquierda", altura: 172, asistio: true  },
  { id: "j-006", nombreCompleto: "Rodrigo Fuentes Díaz",  fechaNacimiento: "2009-09-14", genero: "Masculino", posicionPrincipal: "Contención",            posicionSecundaria: "Defensa central",      piernaHabil: "Derecha",    altura: 178, asistio: false },
  { id: "j-007", nombreCompleto: "Fernando Castro Lima",  fechaNacimiento: "2008-01-08", genero: "Masculino", posicionPrincipal: "Volante por derecha",   posicionSecundaria: "Interior",             piernaHabil: "Derecha",    altura: 170, asistio: true  },
  { id: "j-008", nombreCompleto: "Pablo Ramírez Sol",     fechaNacimiento: "2009-05-22", genero: "Masculino", posicionPrincipal: "Lateral derecho",       posicionSecundaria: null,                   piernaHabil: "Derecha",    altura: 174, asistio: true  },
  { id: "j-009", nombreCompleto: "Emilio Vargas Cruz",    fechaNacimiento: "2008-12-03", genero: "Masculino", posicionPrincipal: "Media punta",           posicionSecundaria: "Delantero centro",     piernaHabil: "Izquierda",  altura: 168, asistio: false },
  { id: "j-010", nombreCompleto: "Sebastián Ortiz Pérez", fechaNacimiento: "2009-08-17", genero: "Masculino", posicionPrincipal: "Volante por izquierda", posicionSecundaria: "Contención",           piernaHabil: "Izquierda",  altura: 176, asistio: true  },
];

// ─── API ──────────────────────────────────────────────────────────────────────
export const jugadoresApi = {
  getByVisoría: (visoriaId) =>
    USE_MOCK
      ? Promise.resolve({ jugadores: MOCK_JUGADORES })
      : apiClient.get(`/visorias/${visoriaId}/jugadores`),

  registrar: (visoriaId, data) =>
    USE_MOCK
      ? Promise.resolve({
          jugador: { id: `j-${Date.now()}`, ...data, asistio: false, qrCode: "data:mock-qr" },
        })
      : apiClient.post(`/visorias/${visoriaId}/registro`, data),

  confirmarAsistencia: (jugadorId) =>
    USE_MOCK
      ? Promise.resolve({ asistio: true })
      : apiClient.post(`/jugadores/${jugadorId}/asistencia`),
};
