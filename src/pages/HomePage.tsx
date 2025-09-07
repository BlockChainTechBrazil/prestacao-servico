// src/pages/HomePage.tsx
import { HomeIcon, UsersIcon } from '../components/Icons';
import { useApp } from '../context/useApp';

export const HomePage = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <HomeIcon className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Bem-vindo ao App</h1>
          <p className="mt-4 text-lg text-gray-600">Faça login para acessar as funcionalidades</p>
        </div>
        {user ? (
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <UsersIcon className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
                <p className="text-gray-600">Gerencie seus clientes</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <HomeIcon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600">Visão geral do sistema</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
