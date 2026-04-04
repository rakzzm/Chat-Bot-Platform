import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bot, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [bots, setBots] = useState<any[]>([]);
  const [stats, setStats] = useState({ botCount: 0, conversationCount: 0 });

  useEffect(() => {
    axios.get('/api/bots').then(({ data }) => {
      setBots(data);
      setStats((prev) => ({ ...prev, botCount: data.length }));
    });
    axios.get('/api/conversations').then(({ data }) => {
      setStats((prev) => ({ ...prev, conversationCount: data.length }));
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600/20 rounded-lg">
              <Bot size={24} className="text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bots</p>
              <p className="text-2xl font-bold text-white">{stats.botCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <MessageSquare size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Conversations</p>
              <p className="text-2xl font-bold text-white">{stats.conversationCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Users size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Subscribers</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Messages Today</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">My Bots</h2>
        <Link
          to="/bots/new"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 text-sm"
        >
          Create Bot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Bot size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 mb-4">No bots created yet</p>
          <Link to="/bots/new" className="text-teal-400 hover:underline">
            Create your first bot
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-5 hover:border-gray-600 transition"
            >
              <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
              {bot.description && (
                <p className="text-gray-400 mt-2 text-sm">{bot.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-3">Model: {bot.model}</p>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/bots/${bot.id}`}
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  Edit
                </Link>
                <Link
                  to={`/bots/${bot.id}/editor`}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Visual Editor
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
