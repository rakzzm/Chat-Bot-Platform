import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, GitBranch, Trash2, Star } from 'lucide-react';

export default function Flows() {
  const [bots, setBots] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [flows, setFlows] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newFlowLabel, setNewFlowLabel] = useState('');

  useEffect(() => {
    axios.get('/api/bots').then(({ data }) => setBots(data));
  }, []);

  useEffect(() => {
    if (!selectedBot) return;
    axios.get(`/api/bots/${selectedBot}/flows`).then(({ data }) => setFlows(data));
  }, [selectedBot]);

  const createFlow = async () => {
    if (!newFlowLabel.trim() || !selectedBot) return;
    try {
      const { data } = await axios.post('/api/flows', {
        label: newFlowLabel,
        botId: selectedBot,
      });
      setFlows((prev) => [...prev, data]);
      setNewFlowLabel('');
      setShowCreate(false);
    } catch {}
  };

  const deleteFlow = async (id: string) => {
    if (!confirm('Delete this flow?')) return;
    await axios.delete(`/api/flows/${id}`);
    setFlows((prev) => prev.filter((f) => f.id !== id));
  };

  const setStartFlow = async (id: string) => {
    await axios.patch(`/api/flows/${id}`, { isStart: true });
    setFlows((prev) => prev.map((f) => ({ ...f, isStart: f.id === id })));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Flows</h1>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Select Bot</label>
        <select
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Choose a bot...</option>
          {bots.map((bot) => (
            <option key={bot.id} value={bot.id}>{bot.name}</option>
          ))}
        </select>
      </div>

      {!selectedBot ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <GitBranch size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Select a bot to view its flows</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              {bots.find((b) => b.id === selectedBot)?.name} - Flows
            </h2>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 flex items-center gap-1 text-sm"
            >
              <Plus size={14} /> New Flow
            </button>
          </div>

          {showCreate && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFlowLabel}
                  onChange={(e) => setNewFlowLabel(e.target.value)}
                  placeholder="Flow name..."
                  className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && createFlow()}
                  autoFocus
                />
                <button onClick={createFlow} className="bg-teal-600 text-white px-4 py-2 rounded text-sm">Create</button>
                <button onClick={() => setShowCreate(false)} className="text-gray-400 px-3 py-2 text-sm hover:text-white">Cancel</button>
              </div>
            </div>
          )}

          {flows.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400 mb-4">No flows yet</p>
              <button onClick={() => setShowCreate(true)} className="text-teal-400 hover:underline text-sm">
                Create your first flow
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Label</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Start Flow</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Updated</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flows.map((flow) => (
                    <tr key={flow.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-white font-medium">{flow.label}</td>
                      <td className="px-4 py-3">
                        {flow.isStart ? (
                          <span className="text-teal-400 text-xs flex items-center gap-1">
                            <Star size={12} /> Start
                          </span>
                        ) : (
                          <button
                            onClick={() => setStartFlow(flow.id)}
                            className="text-gray-500 hover:text-teal-400 text-xs"
                          >
                            Set as start
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(flow.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/bots/${selectedBot}/editor`}
                            className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-blue-400"
                            title="Open in Visual Editor"
                          >
                            <GitBranch size={16} />
                          </Link>
                          <button
                            onClick={() => deleteFlow(flow.id)}
                            className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
