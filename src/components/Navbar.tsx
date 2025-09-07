// src/components/Navbar.tsx
import { UserIcon } from './Icons';
import { useApp } from '../context/useApp';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const { user, signOut, signInWithGoogle } = useApp();

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-tight">BCT Prestação de Serviços</h1>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-5">
            {user && (
              <>
                <NavLink to="/" className={({ isActive }) => `text-sm px-2 py-1 rounded ${isActive ? 'text-blue-700 bg-blue-100' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100'}`}>
                  Início
                </NavLink>
                <NavLink to="/clientes" className={({ isActive }) => `text-sm px-2 py-1 rounded ${isActive ? 'text-blue-700 bg-blue-100' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100'}`}>
                  Clientes
                </NavLink>
                <NavLink to="/servicos" className={({ isActive }) => `text-sm px-2 py-1 rounded ${isActive ? 'text-blue-700 bg-blue-100' : 'text-gray-700 hover:text-blue-700 hover:bg-blue-100'}`}>
                  Serviços
                </NavLink>
              </>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserIcon className="w-5 h-5 text-green-600" />
                <span className="hidden sm:inline text-sm text-gray-700">{user.name}</span>
                <button onClick={signOut} className="ml-1 sm:ml-3 text-xs sm:text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors">Sair</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium shadow">
                Entrar com Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
