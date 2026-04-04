import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, MessageSquare, Bot } from 'lucide-react';

export default function Analytics() {
  const [bots, setBots] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState('');
  const [stats, setStats] = useState({ totalConversations: 0, totalMessages: 0, conversationsByDay: [], topBots: [] });

  useEffect(() => {
    axios.get('/api/bots').then(({ data }) => setBots(data));
  }, []);

  useEffect(() => {
    axios.get('/api/analytics', { params: { botId: selectedBot || undefined } })
      .then(({ data }) => setStats(data))
      .catch(() => setStats({ totalConversations: 0, totalMessages: 0, conversationsByDay: [], topBots: [] }));
  }, [selectedBot]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <select
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">All Bots</option>
          {bots.map((bot) => (
            <option key={bot.id} value={bot.id}>{bot.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <MessageSquare size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-white">{stats.totalConversations}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Bot size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Bots</p>
              <p className="text-2xl font-bold text-white">{bots.length}</p>
            </div>
          </div>
        </div>
      </div>

      {stats.topBots?.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Top Bots by Conversations</h3>
          <div className="space-y-2">
            {stats.topBots.map((bot: any, i: number) => (
              <div key={bot.id} className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-6">{i + 1}</span>
                <span className="text-white text-sm flex-1">{bot.name}</span>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (bot.count / (stats.topBots[0] as any)?.count || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">{bot.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.conversationsByDay?.length === 0 && (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <BarChart3 size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No analytics data yet. Data will appear as users interact with your bots.</p>
        </div>
      )}
    </div>
  );
}
