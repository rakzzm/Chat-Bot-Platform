import { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, Plus, Trash2 } from 'lucide-react';

export default function NLU() {
  const [activeTab, setActiveTab] = useState<'intents' | 'entities'>('intents');
  const [intents, setIntents] = useState<any[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', examples: '', responses: '' });

  useEffect(() => {
    axios.get('/api/nlu/intents').then(({ data }) => setIntents(data)).catch(() => setIntents([]));
    axios.get('/api/nlu/entities').then(({ data }) => setEntities(data)).catch(() => setEntities([]));
  }, []);

  const createIntent = async () => {
    if (!newItem.name.trim()) return;
    try {
      const { data } = await axios.post('/api/nlu/intents', {
        name: newItem.name,
        examples: newItem.examples.split('\n').filter(Boolean),
        responses: newItem.responses.split('\n').filter(Boolean),
      });
      setIntents((prev) => [...prev, data]);
      setNewItem({ name: '', examples: '', responses: '' });
      setShowCreate(false);
    } catch {}
  };

  const deleteIntent = async (id: string) => {
    await axios.delete(`/api/nlu/intents/${id}`);
    setIntents((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">NLU</h1>
        {activeTab === 'intents' && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 flex items-center gap-1 text-sm"
          >
            <Plus size={14} /> New Intent
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => { setActiveTab('intents'); setShowCreate(false); }}
          className={`px-4 py-1.5 rounded-md text-sm ${activeTab === 'intents' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Intents
        </button>
        <button
          onClick={() => { setActiveTab('entities'); setShowCreate(false); }}
          className={`px-4 py-1.5 rounded-md text-sm ${activeTab === 'entities' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Entities
        </button>
      </div>

      {activeTab === 'intents' && (
        <>
          {showCreate && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 space-y-3">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Intent name (e.g., greeting)"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
              <textarea
                value={newItem.examples}
                onChange={(e) => setNewItem({ ...newItem, examples: e.target.value })}
                placeholder="Training examples (one per line)"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                rows={3}
              />
              <textarea
                value={newItem.responses}
                onChange={(e) => setNewItem({ ...newItem, responses: e.target.value })}
                placeholder="Responses (one per line)"
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button onClick={createIntent} className="bg-teal-600 text-white px-4 py-1.5 rounded text-sm">Create</button>
                <button onClick={() => setShowCreate(false)} className="text-gray-400 px-3 py-1.5 text-sm hover:text-white">Cancel</button>
              </div>
            </div>
          )}

          {intents.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
              <Brain size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No intents defined yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {intents.map((intent) => (
                <div key={intent.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{intent.name}</h3>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Examples:</p>
                        <div className="flex flex-wrap gap-1">
                          {intent.examples?.slice(0, 5).map((ex: string, i: number) => (
                            <span key={i} className="bg-gray-700 text-gray-300 rounded px-2 py-0.5 text-xs">{ex}</span>
                          ))}
                          {intent.examples?.length > 5 && (
                            <span className="text-gray-500 text-xs">+{intent.examples.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteIntent(intent.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'entities' && (
        <>
          {entities.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No entities defined yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entities.map((entity) => (
                <div key={entity.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{entity.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entity.values?.slice(0, 10).map((v: any, i: number) => (
                          <span key={i} className="bg-purple-600/20 text-purple-400 rounded px-2 py-0.5 text-xs">
                            {typeof v === 'string' ? v : JSON.stringify(v)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
