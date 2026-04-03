import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface BotForm {
  name: string;
  description: string;
  systemPrompt: string;
  model: string;
}

const MODELS = [
  'qwen/qwen3.6-plus:free',
  'qwen/qwen3-coder:free',
  'qwen/qwen-plus:free',
  'google/gemini-2.5-flash:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o',
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<BotForm>({
    name: '',
    description: '',
    systemPrompt: 'You are a helpful assistant.',
    model: 'qwen/qwen3.6-plus:free',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`/api/bots/${id}`).then(({ data }) => setForm(data));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await axios.patch(`/api/bots/${id}`, form);
      } else {
        await axios.post('/api/bots', form);
      }
      navigate('/dashboard');
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Bot' : 'Create Bot'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bot Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">System Prompt</label>
          <textarea
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
            rows={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : id ? 'Update Bot' : 'Create Bot'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
