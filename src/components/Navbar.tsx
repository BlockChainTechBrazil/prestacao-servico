// src/components/Navbar.tsx
import { UserIcon } from './Icons';
import { useApp } from '../context/useApp';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const { user, signOut, signInWithGoogle } = useApp();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Prestação de Serviço</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
                  Início
                </NavLink>
                <NavLink to="/clientes" className={({ isActive }) => `text-sm ${isActive ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
                  Clientes
                </NavLink>
                <NavLink to="/servicos" className={({ isActive }) => `text-sm ${isActive ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}>
                  Serviços
                </NavLink>
              </>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">{user.name}</span>
                <button onClick={signOut} className="ml-3 text-sm text-red-600 hover:underline">Sair</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Entrar com Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
