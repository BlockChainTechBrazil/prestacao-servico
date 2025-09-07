// src/pages/LoginPage.tsx
import { useState } from 'react';
import { UserIcon } from '../components/Icons';
import { useApp } from '../context/useApp';

export const LoginPage = ({ navigate }: { navigate: (path: string) => void }) => {
  const { loading, user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useApp();
  const [loginType, setLoginType] = useState<'email' | 'google'>('email');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Erro ao fazer login.';
      setError(message);
    }
  };

  const handleEmailSignup = async () => {
    setError(null);
    try {
      await signUpWithEmail(email, password);
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || 'Erro ao criar conta.';
      setError(message);
    }
  };

  if (user) { navigate('/'); return null; }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{mode === 'login' ? 'Faça login na sua conta' : 'Crie sua conta'}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{mode === 'login' ? 'Entre com email/senha ou Google' : 'Cadastre-se com email/senha ou Google'}</p>
        </div>
        <div className="bg-white rounded-lg shadow px-8 py-6">
          <div className="text-right text-sm mb-3">
            {mode === 'login' ? (
              <button className="text-blue-600 hover:underline" onClick={() => setMode('signup')}>Não tem conta? Cadastre-se</button>
            ) : (
              <button className="text-blue-600 hover:underline" onClick={() => setMode('login')}>Já tem conta? Entrar</button>
            )}
          </div>
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              {mode === 'login' ? (
                <button onClick={handleEmailLogin} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">Entrar</button>
              ) : (
                <button onClick={handleEmailSignup} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">Cadastrar</button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              <button onClick={signInWithGoogle} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">{mode === 'login' ? 'Login com Google' : 'Cadastrar com Google'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
