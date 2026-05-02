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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
