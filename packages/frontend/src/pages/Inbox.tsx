import { useState, useEffect } from 'react';
import { getConversations, getMessages, sendMessage } from '../lib/api';
import type { Conversation, Message } from '../types';
import { Search, MessageSquare, User } from 'lucide-react';

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getConversations().then((data) => setConversations(data));
  }, []);

  useEffect(() => {
    if (!selectedConv) return;
    getMessages(selectedConv).then((data) => setMessages(data));
  }, [selectedConv]);

  const handleSend = async () => {
    if (!input.trim() || !selectedConv || loading) return;
    const conv = conversations.find((c) => c.id === selectedConv);
    if (!conv) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim(), createdAt: new Date().toISOString(), conversationId: selectedConv, metadata: null };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const data = await sendMessage({ botId: conv.botId, message: userMsg.content });
      setMessages((prev) => [...prev, data.botMessage]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Error sending message.', createdAt: new Date().toISOString(), conversationId: selectedConv, metadata: null }]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex">
      {/* Conversation list */}
      <div className={`w-full md:w-80 border-r border-gray-700 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-2">Inbox</h2>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-md border border-gray-600 bg-gray-700 pl-8 pr-3 py-1.5 text-white text-sm placeholder-gray-500 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare size={32} className="mx-auto mb-2" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full text-left px-3 py-3 border-b border-gray-700/50 hover:bg-gray-700/50 transition ${
                  selectedConv === conv.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600/30 flex items-center justify-center shrink-0">
                    <User size={14} className="text-teal-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-500">{new Date(conv.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
        {selectedConv ? (
          <>
            <div className="h-12 border-b border-gray-700 flex items-center px-4">
              <button
                onClick={() => setSelectedConv(null)}
                className="md:hidden mr-2 text-gray-400"
              >
                ←
              </button>
              <span className="text-white font-medium">{conversations.find((c) => c.id === selectedConv)?.title}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                    msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-400 text-sm">Thinking...</div>
                </div>
              )}
            </div>
            <div className="border-t border-gray-700 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 text-sm"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-3 text-gray-600" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
