import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Bot, Trash2, Edit, GitBranch } from 'lucide-react';

export default function BotList() {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/bots').then(({ data }) => {
      setBots(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bot?')) return;
    await axios.delete(`/api/bots/${id}`);
    setBots((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Bots</h1>
        <Link
          to="/bots/new"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New Bot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <Bot size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 mb-4">No bots yet</p>
          <Link to="/bots/new" className="text-teal-400 hover:underline">
            Create your first bot
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Model</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Created</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bots.map((bot) => (
                <tr key={bot.id} className="border-b border-gray-700/50 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{bot.name}</span>
                    {bot.description && (
                      <p className="text-sm text-gray-400 mt-0.5">{bot.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{bot.model}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(bot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/bots/${bot.id}/editor`}
                        className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-blue-400"
                        title="Visual Editor"
                      >
                        <GitBranch size={16} />
                      </Link>
                      <Link
                        to={`/bots/${bot.id}`}
                        className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-teal-400"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(bot.id)}
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
    </div>
  );
}
