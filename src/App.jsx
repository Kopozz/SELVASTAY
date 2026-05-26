/**
 * App.jsx — SelvaStay Pro
 * Rutas principales de la aplicación del Eco-Lodge
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ReservasPage from './pages/ReservasPage';
import ClientesPage from './pages/ClientesPage';
import ServiciosPage from './pages/ServiciosPage';
import ConfigPage from './pages/ConfigPage';
import LoginPage from './pages/LoginPage';
import ProyectosPage from './pages/ProyectosPage';
import { BusinessConfigProvider } from './hooks/useBusinessConfig';

export default function App() {
  return (
    <BusinessConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/proyectos" element={<ProyectosPage />} />
          </Route>
          {/* Redirect unknown routes to login for demo */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </BusinessConfigProvider>
  );
}

