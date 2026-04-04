import { useState, useEffect } from 'react';
import { getSubscribers, getLabels, createLabel as apiCreateLabel, deleteLabel } from '../lib/api';
import type { Subscriber, Label } from '../types';
import { Users, Plus, Tag, Trash2 } from 'lucide-react';

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [showCreateLabel, setShowCreateLabel] = useState(false);
  const [newLabel, setNewLabel] = useState({ title: '', name: '', description: '' });

  useEffect(() => {
    getSubscribers().then((data) => setSubscribers(data)).catch(() => setSubscribers([]));
    getLabels().then((data) => setLabels(data)).catch(() => setLabels([]));
  }, []);

  const createLabel = async () => {
    if (!newLabel.title.trim() || !newLabel.name.trim()) return;
    try {
      const data = await apiCreateLabel(newLabel);
      setLabels((prev) => [...prev, data]);
      setNewLabel({ title: '', name: '', description: '' });
      setShowCreateLabel(false);
    } catch {}
  };

  const handleDeleteLabel = async (id: string) => {
    if (!confirm('Delete this label?')) return;
    await deleteLabel(id);
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Subscribers</h1>
        <button
          onClick={() => setShowCreateLabel(true)}
          className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 flex items-center gap-1 text-sm"
        >
          <Tag size={14} /> Manage Labels
        </button>
      </div>

      {showCreateLabel && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-white mb-3">Labels</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-1 text-sm text-gray-300">
                <Tag size={12} />
                {label.title}
                <button onClick={() => handleDeleteLabel(label.id)} className="ml-1 text-gray-500 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLabel.title}
              onChange={(e) => setNewLabel({ ...newLabel, title: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="Label title..."
              className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1.5 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <button onClick={createLabel} className="bg-teal-600 text-white px-3 py-1.5 rounded text-sm">Add</button>
            <button onClick={() => setShowCreateLabel(false)} className="text-gray-400 px-3 py-1.5 text-sm hover:text-white">Close</button>
          </div>
        </div>
      )}

      {subscribers.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <Users size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No subscribers yet. They will appear when users interact with your bots.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Channel</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Labels</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{sub.firstName || 'Unknown'} {sub.lastName || ''}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 capitalize">{sub.channel}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {sub.labels?.map((label: any) => (
                        <span key={label.id} className="bg-teal-600/20 text-teal-400 rounded-full px-2 py-0.5 text-xs">
                          {label.title}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
