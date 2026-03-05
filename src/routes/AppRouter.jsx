import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import SoyDtLoginPage from "../pages/SoyDtLoginPage";
import ProtectedRoute from "./ProtectedRoute";

// Páginas DT
import DashboardPage from "../pages/DashboardPage";
import VisoriaCreatePage from "../pages/VisoriaCreatePage";
import VisoriaDetailPage from "../pages/VisoriaDetailPage";

// Páginas públicas de jugadores
// import RegistroJugadorPage from "../pages/RegistroJugadorPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Rutas públicas ──────────────────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="soy-dt" element={<SoyDtLoginPage />} />
          {/* <Route path="registro/:visoriaId" element={<RegistroJugadorPage />} /> */}
        </Route>

        {/* ── Rutas protegidas (DT autenticado) ───────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="visorias/nueva" element={<VisoriaCreatePage />} />
            <Route path="visorias/:id" element={<VisoriaDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
