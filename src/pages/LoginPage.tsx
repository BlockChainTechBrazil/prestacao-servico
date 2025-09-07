// src/pages/LoginPage.tsx
import { useState } from 'react';
import { UserIcon } from '../components/Icons';
import { useApp } from '../context/useApp';

export const LoginPage = ({ navigate }: { navigate: (path: string) => void }) => {
  const { loading, user, signInWithEmail, signInWithGoogle } = useApp();
  const [loginType, setLoginType] = useState<'email' | 'google'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Erro ao fazer login.';
      alert(message);
    }
  };

  if (user) { navigate('/'); return null; }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Faça login na sua conta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Entre com email/senha ou Google</p>
        </div>
        <div className="bg-white rounded-lg shadow px-8 py-6">
          <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button onClick={() => setLoginType('email')} className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors">
              <UserIcon className="inline-block w-4 h-4 mr-2" /> Email </button>
            <button onClick={() => setLoginType('google')} className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors">
              Google </button>
          </div>
          {loginType === 'email' ? (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="********" />
              </div>
              <button onClick={handleEmailLogin} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">Entrar</button>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              <button onClick={signInWithGoogle} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">Login com Google</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
