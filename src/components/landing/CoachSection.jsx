const CoachSection = () => {
  return (
    <section id="soy-dt" className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-white backdrop-blur md:px-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Soy DT
          </p>
          <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
            Acceso para dueños de visorías.
          </h2>
          <p className="mt-3 text-sm text-white/65 md:text-base">
            Gestiona tus visorías, revisa registros y controla asistencia desde un solo panel.
          </p>
        </div>
        <button className="rounded-full border border-emerald-300/40 px-5 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/10">
          Iniciar sesión
        </button>
      </div>
    </section>
  );
};

export default CoachSection;
