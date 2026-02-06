import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0f2a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 text-xs font-semibold text-emerald-200">
              C
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Cantera
              </p>
              <p className="text-xs text-white/50">Visorías digitales</p>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-white/70">
            <a className="transition hover:text-emerald-200" href="#features">
              Características
            </a>
            <a className="transition hover:text-emerald-200" href="#soy-dt">
              Soy DT
            </a>
            <a className="transition hover:text-emerald-200" href="#contact">
              Contacto
            </a>
            <button className="rounded-full border border-emerald-300/40 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10">
              Agendar demo
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-[#0b0f2a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-white/50">
          <span>© 2026 Cantera. Todos los derechos reservados.</span>
          <span>Visorías digitales para clubes</span>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
