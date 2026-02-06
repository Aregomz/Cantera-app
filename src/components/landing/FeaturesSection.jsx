const features = [
  {
    title: "Crea visorías en minutos",
    description:
      "Define lugar, fecha y hora. Comparte el link para que los jugadores se registren sin fricción.",
  },
  {
    title: "Registro con QR automático",
    description:
      "Cada jugador obtiene su QR. El staff lo escanea al llegar y valida asistencia en segundos.",
  },
  {
    title: "Datos y posiciones al instante",
    description:
      "Accede a perfiles, posiciones y métricas para armar equipos y tomar decisiones más rápido.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="flex flex-col gap-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Beneficios
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
          Todo lo que tu visoría necesita en un solo flujo.
        </h2>
        <p className="mt-3 text-sm text-white/65">
          Sin registros manuales, sin papeles. Cantera organiza datos y asistencia en segundos.
        </p>
      </div>
      <div className="flex flex-col">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="border-t border-white/10 py-10 md:py-12"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-emerald-200">
                  {`0${index + 1}`}
                </span>
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-white/65 md:max-w-2xl">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </section>
  );
};

export default FeaturesSection;
