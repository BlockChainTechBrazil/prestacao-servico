// src/pages/HomePage.tsx
import { HomeIcon, UsersIcon } from '../components/Icons';
import heroSvg from '../assets/hero-services.svg';
import { useApp } from '../context/useApp';
import { NavLink } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <HomeIcon className="mx-auto h-14 w-14 text-blue-600" />
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Gestão para Empresas Prestadoras de Serviços</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Organize clientes, cadastre serviços prestados e acompanhe sua operação em um só lugar.</p>
          <img src={heroSvg} alt="Ilustração" className="mx-auto mt-8 w-full max-w-3xl" />
          {!user && (
            <NavLink to="/login" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
              Entrar para começar
            </NavLink>
          )}
        </div>
        {user ? (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100">
                <UsersIcon className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
                <p className="text-gray-600 mb-4">Cadastre e gerencie seus clientes.</p>
                <NavLink to="/clientes" className="text-sm font-medium text-blue-600 hover:text-blue-700">Ir para Clientes →</NavLink>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100">
                <HomeIcon className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços</h3>
                <p className="text-gray-600 mb-4">Registre serviços prestados e valores.</p>
                <NavLink to="/servicos" className="text-sm font-medium text-blue-600 hover:text-blue-700">Ir para Serviços →</NavLink>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100">
                <HomeIcon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600">Visão geral do sistema (em breve).</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
