import { useState } from "react";

const SoyDtLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="w-full bg-[#0b0f2a] text-white">
      <div className="grid min-h-[calc(100vh-148px)] md:grid-cols-2">
        <div className="relative overflow-hidden bg-gradient-to-b from-emerald-400 to-emerald-500 px-8 py-14 text-[#07211b] md:px-16">
          <div className="flex h-full items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#063327]/80">Cantera · Soy DT</p>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">Bienvenido de vuelta</h1>
              <p className="mt-4 max-w-md text-base text-[#063327]/85 md:text-xl">
                Ingresa con tu usuario y contraseña para continuar con la gestión de visorías.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 top-0 h-full w-24 rounded-l-full bg-[#0b0f2a] md:-right-24 md:w-36" />
        </div>

        <div className="flex items-center justify-center px-8 py-14 md:px-16">
          <div className="w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Acceso al portal</p>
            <h2 className="mt-3 text-4xl font-bold text-white">Iniciar sesión</h2>

            <form className="mt-10 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="username">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Usuario"
                className="w-full rounded-full border border-white/15 bg-[#0f1433] px-5 py-3.5 text-base text-white outline-none transition placeholder:text-white/40 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
                autoComplete="username"
                required
              />

              <label className="sr-only" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-full border border-white/15 bg-[#0f1433] px-5 py-3.5 text-base text-white outline-none transition placeholder:text-white/40 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
                autoComplete="current-password"
                required
              />

              <button
                type="submit"
                className="mt-3 w-full rounded-full bg-emerald-300 px-6 py-3.5 text-base font-semibold text-emerald-950 transition hover:bg-emerald-200"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoyDtLoginPage;
