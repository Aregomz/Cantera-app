import { useEffect } from "react";
import { Link } from "react-router-dom";
import { visoriasApi } from "../api/visoriasApi";
import { useAuth } from "../hooks/useAuth";
import useAsync from "../hooks/useAsync";

// ─── Tarjeta de visoría ───────────────────────────────────────────────────────
const VisoriaCard = ({ visoría }) => {
  const fecha = new Date(visoría.fecha + "T12:00:00").toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      to={`/visorias/${visoría.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.08]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white transition group-hover:text-emerald-300">
              {visoría.nombreEquipo}
            </h3>
            <p className="mt-0.5 text-xs text-white/40">{visoría.rama}</p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {visoría.jugadoresCount} jugadores
          </span>
        </div>

        {visoría.categorias?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visoría.categorias.map((c) => (
              <span key={c} className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/50">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <CalendarIcon />
          {fecha} · {visoría.hora}
        </span>
        <span className="flex items-center gap-1.5">
          <LocationIcon />
          {visoría.lugar}
        </span>
      </div>
    </Link>
  );
};

// ─── Estado vacío ─────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/5">
      <ClipboardIcon />
    </div>
    <h2 className="mt-6 text-2xl font-bold text-white">Aún no tienes visorías</h2>
    <p className="mt-2 max-w-sm text-white/50">
      Crea tu primera visoría y comparte el link para que los jugadores se registren solos.
    </p>
    <Link
      to="/visorias/nueva"
      className="mt-8 rounded-full bg-emerald-400 px-8 py-3.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
    >
      Crear primera visoría
    </Link>
  </div>
);

// ─── Página principal ─────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  const { data, loading, error, execute } = useAsync(visoriasApi.getAll);

  useEffect(() => {
    execute();
  }, [execute]);

  const visorias = data?.visorias ?? [];

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/50">Hola, {user?.nombre?.split(" ")[0]}</p>
          <h1 className="mt-0.5 text-3xl font-bold text-white">Mis visorías</h1>
        </div>

        {visorias.length > 0 && (
          <Link
            to="/visorias/nueva"
            className="self-start rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 sm:self-auto"
          >
            + Nueva visoría
          </Link>
        )}
      </div>

      {/* Contenido */}
      <div className="mt-8">
        {loading && <LoadingGrid />}

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Error al cargar las visorías. Intenta de nuevo.
          </p>
        )}

        {!loading && !error && visorias.length === 0 && <EmptyState />}

        {!loading && !error && visorias.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visorias.map((v) => (
              <VisoriaCard key={v.id} visoría={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const LoadingGrid = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    ))}
  </div>
);

// ─── Iconos inline ─────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

export default DashboardPage;
