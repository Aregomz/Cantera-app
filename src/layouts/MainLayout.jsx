import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isSoyDtRoute = location.pathname.startsWith("/soy-dt");
  const isAppRoute = !!user; // cualquier ruta con sesión activa

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0b0f2a] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0f2a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to={isAppRoute ? "/dashboard" : "/"} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 text-xs font-semibold text-emerald-200">
              C
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Cantera</p>
              <p className="text-xs text-white/50">Visorías digitales</p>
            </div>
          </Link>

          {/* Nav según estado de sesión */}
          {isAppRoute ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-white/50 sm:block">
                {user.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-red-400/40 hover:text-red-400"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <nav className="flex items-center gap-6 text-sm text-white/70">
              <a className="transition hover:text-emerald-200" href="#features">
                Características
              </a>
              <Link className="transition hover:text-emerald-200" to="/soy-dt">
                Soy DT
              </Link>
              <a className="transition hover:text-emerald-200" href="#contact">
                Contacto
              </a>
              <button className="rounded-full border border-emerald-300/40 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10">
                Agendar demo
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className={isSoyDtRoute ? "w-full" : "mx-auto w-full max-w-6xl px-6 py-12"}>
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
