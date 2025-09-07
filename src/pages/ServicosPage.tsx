// src/pages/ServicosPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/useApp';
import { db } from '../firebaseConfig';
import { Timestamp, addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

interface ClienteRef {
  id: string;
  nome: string;
}

interface Servico {
  id: string;
  clienteId: string;
  clienteNome?: string;
  descricao: string;
  valor: number;
  data: string; // ISO date string
  createdAt?: Timestamp | null;
}

export const ServicosPage = () => {
  const { user, authReady } = useApp();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<ClienteRef[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [novoServico, setNovoServico] = useState({ clienteId: '', descricao: '', valor: '', data: '' });

  useEffect(() => {
    const q = query(collection(db, 'servicos'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data: Servico[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Servico, 'id'>) }));
      setServicos(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    getDocs(collection(db, 'clientes')).then((snap) => {
      const list: ClienteRef[] = snap.docs.map((d) => {
        const data = d.data() as { nome?: string };
        return { id: d.id, nome: data.nome || 'Sem nome' };
      });
      setClientes(list);
    });
  }, []);

  const clientesById = useMemo(() => Object.fromEntries(clientes.map(c => [c.id, c.nome])), [clientes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoServico.clienteId || !novoServico.descricao || !novoServico.valor || !novoServico.data) return;
    await addDoc(collection(db, 'servicos'), {
      clienteId: novoServico.clienteId,
      descricao: novoServico.descricao,
      valor: Number(novoServico.valor),
      data: novoServico.data,
      createdAt: serverTimestamp(),
    });
    setNovoServico({ clienteId: '', descricao: '', valor: '', data: '' });
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
            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600">Cadastre os serviços prestados aos clientes</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Novo Serviço
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          {servicos.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço</h3>
              <p className="mt-1 text-sm text-gray-500">Comece cadastrando um serviço.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {servicos.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clientesById[s.clienteId] || s.clienteId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.descricao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.data).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
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
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Novo Serviço</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <select value={novoServico.clienteId} onChange={(e) => setNovoServico({ ...novoServico, clienteId: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="" disabled>Selecione um cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input type="text" value={novoServico.descricao} onChange={(e) => setNovoServico({ ...novoServico, descricao: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" value={novoServico.data} onChange={(e) => setNovoServico({ ...novoServico, data: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <input type="number" min="0" step="0.01" value={novoServico.valor} onChange={(e) => setNovoServico({ ...novoServico, valor: e.target.value })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
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
