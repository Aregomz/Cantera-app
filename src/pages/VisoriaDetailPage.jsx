import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jugadoresApi } from "../api/jugadoresApi";
import { visoriasApi } from "../api/visoriasApi";
import useAsync from "../hooks/useAsync";

// ─── Constantes ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "jugadores",  label: "Jugadores"    },
  { id: "escaner",    label: "Escáner QR"   },
  { id: "stats",      label: "Estadísticas" },
  { id: "favoritos",  label: "Favoritos"    },
  { id: "equipos",    label: "Armar equipos"},
];

const GRUPOS_POSICION = {
  Porteros:  ["Portero"],
  Defensas:  ["Defensa central", "Lateral izquierdo", "Lateral derecho"],
  Medios:    ["Contención", "Interior", "Volante por izquierda", "Volante por derecha", "Media punta"],
  Delanteros:["Delantero centro"],
};

const POSICIONES = Object.values(GRUPOS_POSICION).flat();

// ─── Página principal ─────────────────────────────────────────────────────────
const VisoriaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: visoriaData, execute: fetchVisoría } = useAsync(
    useCallback(() => visoriasApi.getById(id), [id])
  );
  const { data: jugadoresData, execute: fetchJugadores } = useAsync(
    useCallback(() => jugadoresApi.getByVisoría(id), [id])
  );

  useEffect(() => {
    fetchVisoría();
    fetchJugadores();
  }, [fetchVisoría, fetchJugadores]);

  const [tab, setTab] = useState("jugadores");
  const [favoritos, setFavoritos] = useState(new Set());
  const [jugadores, setJugadores] = useState([]);

  // Sincroniza jugadores cuando llegan del API
  useEffect(() => {
    if (jugadoresData?.jugadores) setJugadores(jugadoresData.jugadores);
  }, [jugadoresData]);

  const visoría = visoriaData?.visoría;

  const toggleFavorito = (id) =>
    setFavoritos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const marcarAsistencia = async (jugadorId) => {
    await jugadoresApi.confirmarAsistencia(jugadorId);
    setJugadores((prev) =>
      prev.map((j) => (j.id === jugadorId ? { ...j, asistio: true } : j))
    );
  };

  if (!visoría) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
      </div>
    );
  }

  const fecha = new Date(visoría.fecha + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeftIcon /> Mis visorías
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{visoría.nombreEquipo}</h1>
              <span className="rounded-full border border-white/15 px-3 py-0.5 text-xs text-white/50">
                {visoría.rama}
              </span>
              {visoría.categorias?.map((c) => (
                <span key={c} className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-0.5 text-xs text-emerald-400">
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-white/40">
              {fecha} · {visoría.hora} · {visoría.lugar}
            </p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(visoría.registroUrl || window.location.href);
              alert("Link copiado al portapapeles");
            }}
            className="flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10"
          >
            <LinkIcon /> Copiar link de registro
          </button>
        </div>
      </div>

      {/* ── Stats rápidas ──────────────────────────────────────── */}
      <StatsRow jugadores={jugadores} />

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="mt-8 border-b border-white/10">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? "border-b-2 border-emerald-400 text-emerald-300"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.label}
              {t.id === "favoritos" && favoritos.size > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-xs text-emerald-300">
                  {favoritos.size}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "jugadores"  && <TabJugadores jugadores={jugadores} favoritos={favoritos} onToggleFavorito={toggleFavorito} onMarcarAsistencia={marcarAsistencia} />}
        {tab === "escaner"    && <TabEscaner jugadores={jugadores} onMarcarAsistencia={marcarAsistencia} />}
        {tab === "stats"      && <TabStats jugadores={jugadores} />}
        {tab === "favoritos"  && <TabFavoritos jugadores={jugadores.filter((j) => favoritos.has(j.id))} favoritos={favoritos} onToggleFavorito={toggleFavorito} />}
        {tab === "equipos"    && <TabEquipos />}
      </div>
    </div>
  );
};

// ─── Stats rápidas ────────────────────────────────────────────────────────────
const StatsRow = ({ jugadores }) => {
  const total = jugadores.length;
  const presentes = jugadores.filter((j) => j.asistio).length;
  const pct = total > 0 ? Math.round((presentes / total) * 100) : 0;

  const porGrupo = Object.entries(GRUPOS_POSICION).map(([grupo, poss]) => ({
    grupo,
    count: jugadores.filter((j) => poss.includes(j.posicionPrincipal)).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Registrados" value={total} icon={<UsersIcon />} />
      <StatCard label="Con asistencia" value={presentes} icon={<CheckIcon />} accent />
      <StatCard label="% Asistencia" value={`${pct}%`} icon={<ChartIcon />} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/40">Por posición</p>
        <div className="mt-2 flex flex-col gap-1">
          {porGrupo.map(({ grupo, count }) => (
            <div key={grupo} className="flex items-center justify-between text-xs">
              <span className="text-white/60">{grupo}</span>
              <span className="font-semibold text-white">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, accent }) => (
  <div className={`rounded-2xl border p-4 ${accent ? "border-emerald-400/20 bg-emerald-400/5" : "border-white/10 bg-white/5"}`}>
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${accent ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"}`}>
      {icon}
    </div>
    <p className={`mt-3 text-2xl font-bold ${accent ? "text-emerald-300" : "text-white"}`}>{value}</p>
    <p className="text-xs text-white/40">{label}</p>
  </div>
);

// ─── Tab: Lista de jugadores ──────────────────────────────────────────────────
const TabJugadores = ({ jugadores, favoritos, onToggleFavorito, onMarcarAsistencia }) => {
  const [filtros, setFiltros] = useState({ busqueda: "", posicion: "", pierna: "", asistencia: "" });

  const setFiltro = (k, v) => setFiltros((p) => ({ ...p, [k]: v }));

  const filtrados = jugadores.filter((j) => {
    if (filtros.busqueda && !j.nombreCompleto.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
    if (filtros.posicion && j.posicionPrincipal !== filtros.posicion && j.posicionSecundaria !== filtros.posicion) return false;
    if (filtros.pierna && j.piernaHabil !== filtros.pierna) return false;
    if (filtros.asistencia === "presentes" && !j.asistio) return false;
    if (filtros.asistencia === "ausentes" && j.asistio) return false;
    return true;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={filtros.busqueda}
          onChange={(e) => setFiltro("busqueda", e.target.value)}
          placeholder="Buscar jugador..."
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400/40 sm:w-56"
        />
        <FiltroSelect value={filtros.posicion} onChange={(v) => setFiltro("posicion", v)} placeholder="Posición" options={POSICIONES} />
        <FiltroSelect value={filtros.pierna} onChange={(v) => setFiltro("pierna", v)} placeholder="Pierna" options={["Derecha", "Izquierda"]} />
        <FiltroSelect value={filtros.asistencia} onChange={(v) => setFiltro("asistencia", v)} placeholder="Asistencia" options={[["presentes", "Presentes"], ["ausentes", "Ausentes"]]} />
        {Object.values(filtros).some(Boolean) && (
          <button onClick={() => setFiltros({ busqueda: "", posicion: "", pierna: "", asistencia: "" })} className="text-xs text-white/40 underline hover:text-white">
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="mb-3 text-xs text-white/40">{filtrados.length} jugadores</p>

      <div className="flex flex-col gap-2">
        {filtrados.map((j) => (
          <JugadorRow
            key={j.id}
            jugador={j}
            esFavorito={favoritos.has(j.id)}
            onToggleFavorito={() => onToggleFavorito(j.id)}
            onMarcarAsistencia={() => onMarcarAsistencia(j.id)}
          />
        ))}
        {filtrados.length === 0 && (
          <p className="py-12 text-center text-sm text-white/30">No hay jugadores con esos filtros.</p>
        )}
      </div>
    </div>
  );
};

// ─── Fila de jugador ──────────────────────────────────────────────────────────
const JugadorRow = ({ jugador, esFavorito, onToggleFavorito, onMarcarAsistencia }) => {
  const edad = new Date().getFullYear() - new Date(jugador.fechaNacimiento).getFullYear();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
        {jugador.nombreCompleto.charAt(0)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-white">{jugador.nombreCompleto}</span>
          <span className="text-xs text-white/40">{edad} años · {jugador.altura} cm</span>
        </div>
        <div className="mt-0.5 flex flex-wrap gap-1.5">
          <PosTag label={jugador.posicionPrincipal} />
          {jugador.posicionSecundaria && <PosTag label={jugador.posicionSecundaria} secondary />}
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40">
            {jugador.piernaHabil === "Izquierda" ? "🦶 Zurdo" : "🦶 Diestro"}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 items-center gap-2">
        {jugador.asistio ? (
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            Presente
          </span>
        ) : (
          <button
            onClick={onMarcarAsistencia}
            className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/50 transition hover:border-emerald-400/40 hover:text-emerald-300"
          >
            Confirmar
          </button>
        )}
        <button
          onClick={onToggleFavorito}
          className={`transition ${esFavorito ? "text-yellow-400" : "text-white/20 hover:text-white/60"}`}
          title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <StarIcon filled={esFavorito} />
        </button>
      </div>
    </div>
  );
};

// ─── Tab: Escáner QR ──────────────────────────────────────────────────────────
const TabEscaner = ({ jugadores, onMarcarAsistencia }) => {
  const [query, setQuery] = useState("");
  const [recientes, setRecientes] = useState([]);

  const resultado = query.trim().length > 1
    ? jugadores.find((j) => j.nombreCompleto.toLowerCase().includes(query.toLowerCase()) || j.id === query)
    : null;

  const handleConfirmar = async (jugador) => {
    if (jugador.asistio) return;
    await onMarcarAsistencia(jugador.id);
    setRecientes((prev) => [jugador, ...prev.filter((r) => r.id !== jugador.id)].slice(0, 5));
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-lg">
      {/* Zona cámara (placeholder) */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/3 py-12 text-center">
        <QrIcon />
        <p className="mt-3 text-sm font-semibold text-white">Escáner de QR</p>
        <p className="mt-1 text-xs text-white/40">La cámara se activará en la siguiente versión.</p>
        <span className="mt-3 rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-400">
          Próximamente
        </span>
      </div>

      {/* Búsqueda manual */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-white">Confirmación manual</p>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400/40"
          />
        </div>

        {resultado && (
          <div className="mt-2 flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{resultado.nombreCompleto}</p>
              <p className="text-xs text-white/40">{resultado.posicionPrincipal}</p>
            </div>
            {resultado.asistio ? (
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">Ya presente</span>
            ) : (
              <button
                onClick={() => handleConfirmar(resultado)}
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                Confirmar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recientes */}
      {recientes.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Confirmados esta sesión</p>
          <div className="flex flex-col gap-1.5">
            {recientes.map((j) => (
              <div key={j.id} className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-white">{j.nombreCompleto}</span>
                <span className="ml-auto text-xs text-white/30">{j.posicionPrincipal}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab: Estadísticas ────────────────────────────────────────────────────────
const TabStats = ({ jugadores }) => {
  const presentes = jugadores.filter((j) => j.asistio).length;
  const total = jugadores.length;

  const porPierna = {
    Derecha:    jugadores.filter((j) => j.piernaHabil === "Derecha").length,
    Izquierda:  jugadores.filter((j) => j.piernaHabil === "Izquierda").length,
  };

  const porGrupo = Object.entries(GRUPOS_POSICION).map(([grupo, poss]) => ({
    grupo,
    count: jugadores.filter((j) => poss.includes(j.posicionPrincipal)).length,
  }));

  const porPosicion = POSICIONES.map((pos) => ({
    pos,
    count: jugadores.filter((j) => j.posicionPrincipal === pos).length,
  })).filter((p) => p.count > 0);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Asistencia */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white">Asistencia</p>
        <div className="mt-4 flex gap-6">
          <BarraCircular pct={total > 0 ? Math.round((presentes / total) * 100) : 0} label={`${presentes}/${total}`} sub="Presentes" color="emerald" />
        </div>
      </div>

      {/* Pierna hábil */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white">Pierna hábil</p>
        <div className="mt-4 flex flex-col gap-3">
          {Object.entries(porPierna).map(([pierna, count]) => (
            <BarraLineal key={pierna} label={pierna} count={count} total={total} />
          ))}
        </div>
      </div>

      {/* Por grupo */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white">Por línea</p>
        <div className="mt-4 flex flex-col gap-3">
          {porGrupo.map(({ grupo, count }) => (
            <BarraLineal key={grupo} label={grupo} count={count} total={total} />
          ))}
        </div>
      </div>

      {/* Por posición */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-semibold text-white">Por posición</p>
        <div className="mt-4 flex flex-col gap-2">
          {porPosicion.map(({ pos, count }) => (
            <div key={pos} className="flex items-center justify-between text-sm">
              <span className="text-white/60">{pos}</span>
              <span className="font-semibold text-white">{count}</span>
            </div>
          ))}
          {porPosicion.length === 0 && <p className="text-xs text-white/30">Sin datos aún.</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Favoritos ───────────────────────────────────────────────────────────
const TabFavoritos = ({ jugadores, favoritos, onToggleFavorito }) => {
  if (jugadores.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <StarIcon filled={false} className="h-10 w-10 text-white/20" />
        <p className="mt-3 text-sm text-white/40">Aún no tienes jugadores marcados como favoritos.</p>
        <p className="mt-1 text-xs text-white/25">Ve a la pestaña Jugadores y marca la estrella.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {jugadores.map((j) => (
        <JugadorRow
          key={j.id}
          jugador={j}
          esFavorito={favoritos.has(j.id)}
          onToggleFavorito={() => onToggleFavorito(j.id)}
          onMarcarAsistencia={() => {}}
        />
      ))}
    </div>
  );
};

// ─── Tab: Armar equipos (placeholder) ────────────────────────────────────────
const TabEquipos = () => (
  <div className="flex flex-col items-center py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
      <TeamIcon />
    </div>
    <p className="mt-4 text-lg font-semibold text-white">Armado automático de equipos</p>
    <p className="mt-2 max-w-sm text-sm text-white/40">
      Esta función está en planeación. Se evaluará si se implementa con un algoritmo genético o con una API de IA.
    </p>
    <span className="mt-4 rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/40">
      En desarrollo
    </span>
  </div>
);

// ─── Componentes de UI reutilizables ──────────────────────────────────────────
const PosTag = ({ label, secondary }) => (
  <span className={`rounded-full border px-2 py-0.5 text-xs ${secondary ? "border-white/10 text-white/30" : "border-emerald-400/20 text-emerald-400"}`}>
    {label}
  </span>
);

const FiltroSelect = ({ value, onChange, placeholder, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl border border-white/15 bg-[#0b0f2a] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/40"
  >
    <option value="">{placeholder}</option>
    {options.map((o) =>
      Array.isArray(o)
        ? <option key={o[0]} value={o[0]}>{o[1]}</option>
        : <option key={o} value={o}>{o}</option>
    )}
  </select>
);

const BarraLineal = ({ label, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="text-white">{count}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const BarraCircular = ({ pct, label, sub }) => (
  <div className="flex items-center gap-4">
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="-rotate-90" viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle cx="18" cy="18" r="14" fill="none" stroke="#34d399" strokeWidth="3"
          strokeDasharray={`${(pct / 100) * 88} 88`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-bold text-white">{pct}%</span>
    </div>
    <div>
      <p className="text-xl font-bold text-white">{label}</p>
      <p className="text-xs text-white/40">{sub}</p>
    </div>
  </div>
);

// ─── Iconos ───────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const QrIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12v.01M12 4h.01M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4z" />
  </svg>
);
const StarIcon = ({ filled, className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default VisoriaDetailPage;
