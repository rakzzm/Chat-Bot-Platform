import { useState, useEffect } from 'react';
import axios from 'axios';
import { Variable, Plus, Trash2 } from 'lucide-react';

export default function ContextVariables() {
  const [variables, setVariables] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newVar, setNewVar] = useState({ name: '', permanent: false, defaultValue: '' });

  useEffect(() => {
    axios.get('/api/context-variables').then(({ data }) => setVariables(data)).catch(() => setVariables([]));
  }, []);

  const createVar = async () => {
    if (!newVar.name.trim()) return;
    try {
      const { data } = await axios.post('/api/context-variables', newVar);
      setVariables((prev) => [...prev, data]);
      setNewVar({ name: '', permanent: false, defaultValue: '' });
      setShowCreate(false);
    } catch {}
  };

  const deleteVar = async (id: string) => {
    await axios.delete(`/api/context-variables/${id}`);
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Context Variables</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 flex items-center gap-1 text-sm"
        >
          <Plus size={14} /> New Variable
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={newVar.name}
              onChange={(e) => setNewVar({ ...newVar, name: e.target.value })}
              placeholder="Variable name (e.g., user_name)"
              className="flex-1 min-w-[200px] rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <input
              type="text"
              value={newVar.defaultValue}
              onChange={(e) => setNewVar({ ...newVar, defaultValue: e.target.value })}
              placeholder="Default value"
              className="w-40 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={newVar.permanent}
                onChange={(e) => setNewVar({ ...newVar, permanent: e.target.checked })}
                className="rounded border-gray-600 bg-gray-700"
              />
              Permanent
            </label>
            <button onClick={createVar} className="bg-teal-600 text-white px-4 py-2 rounded text-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 px-3 py-2 text-sm hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {variables.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <Variable size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No context variables defined</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Default</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((v) => (
                <tr key={v.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-white font-mono text-sm">{v.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${v.permanent ? 'bg-teal-600/20 text-teal-400' : 'bg-gray-600/30 text-gray-400'}`}>
                      {v.permanent ? 'Permanent' : 'Temporary'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{v.defaultValue || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteVar(v.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
