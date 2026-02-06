const CtaSection = () => {
  return (
    <section id="contact" className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-12 text-white md:px-12">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Ahorra horas en cada visoría.
          </h2>
          <p className="mt-2 text-sm text-white/70 md:text-base">
            Registros digitales, QR y control total de jugadores en un solo lugar.
          </p>
        </div>
        <button className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg transition hover:bg-emerald-200">
          Hablar con ventas
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
