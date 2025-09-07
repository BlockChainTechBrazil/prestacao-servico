// src/routes.tsx 
import { Routes, Route, useNavigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ClientesPage } from './pages/ClientesPage';
import { ServicosPage } from './pages/ServicosPage';

export const AppRoutes = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage navigate={navigate} />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/servicos" element={<ServicosPage />} />
    </Routes>
  );
}; 
