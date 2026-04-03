import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Bot {
  id: string;
  name: string;
  description: string | null;
  model: string;
  createdAt: string;
}

export default function Dashboard() {
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    axios.get('/api/bots').then(({ data }) => setBots(data));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bots</h1>
        <Link
          to="/bots/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Bot
        </Link>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No bots created yet</p>
          <Link to="/bots/new" className="text-indigo-600 hover:underline">
            Create your first bot
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Link
              key={bot.id}
              to={`/bots/${bot.id}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{bot.name}</h2>
              {bot.description && (
                <p className="text-gray-600 mt-2 text-sm">{bot.description}</p>
              )}
              <p className="text-gray-400 text-xs mt-4">Model: {bot.model}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
