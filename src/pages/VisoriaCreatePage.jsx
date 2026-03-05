import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { visoriasApi } from "../api/visoriasApi";

// Años disponibles para categorías
const AÑOS = Array.from({ length: 16 }, (_, i) => String(2015 - i)); // 2015 → 2000

const INITIAL_FORM = {
  nombreEquipo: "",
  categorias: [],
  rama: "",
  fecha: "",
  hora: "",
  lugar: "",
  direccion: "",
  staff: [""],
};

// ─── Componente principal ─────────────────────────────────────────────────────
const VisoriaCreatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Campos simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Categorías (multi-toggle)
  const toggleCategoria = (año) => {
    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(año)
        ? prev.categorias.filter((c) => c !== año)
        : [...prev.categorias, año],
    }));
  };

  // Staff dinámico
  const handleStaffChange = (index, value) => {
    const updated = [...form.staff];
    updated[index] = value;
    setForm((prev) => ({ ...prev, staff: updated }));
  };

  const addStaff = () =>
    setForm((prev) => ({ ...prev, staff: [...prev.staff, ""] }));

  const removeStaff = (index) =>
    setForm((prev) => ({
      ...prev,
      staff: prev.staff.filter((_, i) => i !== index),
    }));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.categorias.length === 0) {
      setError("Selecciona al menos una categoría.");
      return;
    }
    if (!form.rama) {
      setError("Selecciona la rama.");
      return;
    }
    const staffLimpio = form.staff.map((s) => s.trim()).filter(Boolean);
    if (staffLimpio.length === 0) {
      setError("Agrega al menos un visor del staff.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await visoriasApi.create({ ...form, staff: staffLimpio });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al crear la visoría.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeftIcon />
          Mis visorías
        </button>
        <h1 className="text-3xl font-bold text-white">Nueva visoría</h1>
        <p className="mt-1 text-white/50">
          Completa los datos para crear y compartir el link de registro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* ── Nombre del equipo ─────────────────────────────────── */}
        <Field label="Nombre del equipo">
          <input
            name="nombreEquipo"
            value={form.nombreEquipo}
            onChange={handleChange}
            placeholder="Ej. Club Deportivo Águilas"
            required
            className={inputClass}
          />
        </Field>

        {/* ── Rama ──────────────────────────────────────────────── */}
        <Field label="Rama">
          <div className="flex gap-3">
            {["Varonil", "Femenil"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, rama: r }))}
                className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                  form.rama === r
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                    : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>

        {/* ── Categorías ────────────────────────────────────────── */}
        <Field label="Categorías" hint="Selecciona uno o más años de nacimiento">
          <div className="flex flex-wrap gap-2">
            {AÑOS.map((año) => (
              <button
                key={año}
                type="button"
                onClick={() => toggleCategoria(año)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  form.categorias.includes(año)
                    ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
                    : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {año}
              </button>
            ))}
          </div>
        </Field>

        {/* ── Fecha y hora ──────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha">
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              className={inputClass + " [color-scheme:dark]"}
            />
          </Field>
          <Field label="Hora">
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              required
              className={inputClass + " [color-scheme:dark]"}
            />
          </Field>
        </div>

        {/* ── Lugar ─────────────────────────────────────────────── */}
        <Field label="Lugar">
          <input
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            placeholder="Ej. Estadio Municipal, Cancha 3"
            required
            className={inputClass}
          />
        </Field>

        {/* ── Dirección ─────────────────────────────────────────── */}
        <Field label="Dirección">
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Ej. Av. Deportiva 123, Col. Centro"
            required
            className={inputClass}
          />
        </Field>

        {/* ── Staff ─────────────────────────────────────────────── */}
        <Field label="Staff encargado" hint="Nombre(s) de los visores">
          <div className="flex flex-col gap-2">
            {form.staff.map((nombre, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={nombre}
                  onChange={(e) => handleStaffChange(i, e.target.value)}
                  placeholder={`Visor ${i + 1}`}
                  className={inputClass + " flex-1"}
                />
                {form.staff.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStaff(i)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white/40 transition hover:border-red-400/40 hover:text-red-400"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStaff}
              className="mt-1 flex items-center gap-2 self-start text-sm text-emerald-400 transition hover:text-emerald-300"
            >
              <PlusIcon />
              Agregar visor
            </button>
          </div>
        </Field>

        {/* ── Error y submit ────────────────────────────────────── */}
        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex flex-1 items-center justify-center rounded-full bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-900 border-t-transparent" />
            ) : (
              "Crear visoría"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Helpers de UI ────────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10";

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-2">
    <div>
      <label className="text-sm font-semibold text-white">{label}</label>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
    {children}
  </div>
);

// ─── Iconos ───────────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export default VisoriaCreatePage;
