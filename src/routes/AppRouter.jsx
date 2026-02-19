import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import SoyDtLoginPage from "../pages/SoyDtLoginPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="soy-dt" element={<SoyDtLoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
