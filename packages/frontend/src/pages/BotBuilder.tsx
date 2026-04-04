import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBot, createBot, updateBot } from '../lib/api';
import type { CreateBotRequest } from '../types';
import { ArrowLeft, Save } from 'lucide-react';

const MODELS = [
  'qwen/qwen3.6-plus:free',
  'openai/gpt-3.5-turbo',
  'openai/gpt-4',
  'openai/gpt-4-turbo',
  'anthropic/claude-3-sonnet',
  'anthropic/claude-3-haiku',
  'anthropic/claude-3-opus',
  'google/gemini-pro',
  'meta-llama/llama-3-70b-instruct',
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateBotRequest>({
    name: '',
    description: '',
    systemPrompt: 'You are a helpful assistant.',
    model: 'qwen/qwen3.6-plus:free',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      getBot(id).then((data) => setForm({
        name: data.name,
        description: data.description ?? '',
        systemPrompt: data.systemPrompt ?? 'You are a helpful assistant.',
        model: data.model,
      }));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let botId = id;
      if (id) {
        await updateBot(id, form);
      } else {
        const data = await createBot(form);
        botId = data.id;
      }
      navigate(`/bots/${botId}/editor`);
    } catch {
      setError('Failed to save bot');
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/bots')}
        className="flex items-center gap-1 text-gray-400 hover:text-white mb-4 text-sm"
      >
        <ArrowLeft size={16} /> Back to Bots
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">{id ? 'Edit Bot' : 'Create Bot'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Bot Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none"
            placeholder="My Assistant Bot"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none"
            rows={2}
            placeholder="What does this bot do?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 font-mono text-sm focus:border-teal-500 focus:outline-none"
            rows={6}
            placeholder="You are a helpful assistant..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">AI Model</label>
          <select
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <Save size={16} /> {saving ? 'Saving...' : id ? 'Update & Open Editor' : 'Create & Open Editor'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/bots')}
            className="text-gray-400 px-4 py-2 hover:text-white text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
