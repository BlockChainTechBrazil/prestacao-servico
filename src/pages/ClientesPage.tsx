// src/pages/ClientesPage.tsx
import { useEffect, useState } from 'react';
import { UsersIcon, XIcon } from '../components/Icons';
import { useApp } from '../context/useApp';
import { db } from '../firebaseConfig';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  createdAt?: Timestamp | null;
}

export const ClientesPage = () => {
  const { user, authReady } = useApp();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '' });
  const [telefonePais, setTelefonePais] = useState<'BR' | 'US'>('BR');

  const onlyDigits = (v: string) => v.replace(/\D/g, '');

  const formatPhone = (digits: string, country: 'BR' | 'US') => {
    if (country === 'BR') {
      const d = digits.slice(0, 11);
      if (d.length <= 2) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    } else {
      const d = digits.slice(0, 10);
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    }
  };

  const handleTelefoneChange = (v: string) => {
    const digits = onlyDigits(v);
    const formatted = formatPhone(digits, telefonePais);
    setNovoCliente({ ...novoCliente, telefone: formatted });
  };

  useEffect(() => {
    const q = query(collection(db, 'clientes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Cliente[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Cliente, 'id'>) }));
      setClientes(data);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente.nome || !novoCliente.email) return;
    await addDoc(collection(db, 'clientes'), {
      nome: novoCliente.nome,
      email: novoCliente.email,
      telefone: novoCliente.telefone,
      telefonePais,
      createdAt: serverTimestamp(),
    });
    setNovoCliente({ nome: '', email: '', telefone: '' });
    setShowModal(false);
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Carregando sessão...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600">Você precisa fazer login para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Gerencie seus clientes</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <UsersIcon className="inline-block w-4 h-4 mr-2" /> Novo Cliente </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          {clientes.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando seu primeiro cliente.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Novo Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={novoCliente.email} onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">País</label>
                  <select value={telefonePais} onChange={(e) => setTelefonePais(e.target.value as 'BR' | 'US')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="BR">Brasil (+55)</option>
                    <option value="US">Estados Unidos (+1)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    value={novoCliente.telefone}
                    onChange={(e) => handleTelefoneChange(e.target.value)}
                    placeholder={telefonePais === 'BR' ? '(11) 98765-4321' : '(415) 555-0132'}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
