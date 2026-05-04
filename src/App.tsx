import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Alumnos from "./pages/Alumnos";
import Comunicados from "./pages/Comunicados";
import Familias from "./pages/Familias";
import Grupos from "./pages/Grupos";
import Colegiaturas from "./pages/Colegiaturas";
import Comida from "./pages/Comida";
import Galeria from "./pages/Galeria";
import Calendario from "./pages/Calendario";
import Usuarios from "./pages/Usuarios";
import MiCuenta from "./pages/MiCuenta";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/familias" element={<Familias />} />
            <Route path="/grupos" element={<Grupos />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/comunicados" element={<Comunicados />} />
            <Route path="/colegiaturas" element={<Colegiaturas />} />
            <Route path="/comida" element={<Comida />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="mi-cuenta" element={<MiCuenta />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
