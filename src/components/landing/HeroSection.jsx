const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f1433] px-6 py-16 text-white shadow-2xl md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="h-full w-full translate-x-10 opacity-70"
          viewBox="0 0 900 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 420C120 360 260 340 400 360C560 382 700 470 900 500"
            stroke="url(#wave)"
            strokeWidth="2"
          />
          <path
            d="M0 380C140 310 300 290 470 320C650 352 760 430 900 470"
            stroke="url(#wave)"
            strokeWidth="2"
          />
          <path
            d="M0 340C160 260 330 250 520 280C690 310 790 390 900 430"
            stroke="url(#wave)"
            strokeWidth="2"
          />
          <path
            d="M0 300C160 220 350 210 540 240C710 270 810 350 900 390"
            stroke="url(#wave)"
            strokeWidth="2"
          />
          <path
            d="M0 260C160 180 360 170 560 200C720 224 820 310 900 350"
            stroke="url(#wave)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="wave" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22c55e" />
              <stop offset="0.5" stopColor="#34d399" />
              <stop offset="1" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10 flex flex-col gap-6 md:max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
          Cantera
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Visorías de fútbol rápidas, ordenadas y sin papel.
        </h1>
        <p className="text-base text-white/70 md:text-lg">
          Los equipos crean una visoría con lugar, fecha y hora. Los jugadores se registran,
          reciben su QR y el staff solo escanea para confirmar asistencia y ver sus datos al instante.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg transition hover:scale-[1.02]">
            Solicitar demo
          </button>
          <button className="rounded-full border border-emerald-300/40 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/10">
            Conocer más
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
