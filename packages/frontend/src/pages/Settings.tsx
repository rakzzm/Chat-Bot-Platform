import { useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [fallbackMessage, setFallbackMessage] = useState("I'm sorry, I didn't understand that. Could you rephrase?");
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [fallbackCount, setFallbackCount] = useState(3);
  const [chatTitle, setChatTitle] = useState('ChatBot');
  const [greetingMessage, setGreetingMessage] = useState('Hello! How can I help you today?');
  const [widgetTheme, setWidgetTheme] = useState('teal');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const themes = ['teal', 'orange', 'red', 'green', 'blue', 'dark'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
        {['general', 'chatbot', 'web'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm capitalize ${
              activeTab === tab ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-2xl">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">General Settings</h2>
            <p className="text-sm text-gray-400">Account and platform settings will appear here.</p>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="space-y-5">
            <h2 className="text-lg font-medium text-white">Chatbot Fallback</h2>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Enable Fallback</label>
              <button
                onClick={() => setFallbackEnabled(!fallbackEnabled)}
                className={`w-10 h-5 rounded-full transition-colors ${fallbackEnabled ? 'bg-teal-600' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${fallbackEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Fallback Message</label>
              <textarea
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Consecutive Fallback Count</label>
              <input
                type="number"
                value={fallbackCount}
                onChange={(e) => setFallbackCount(parseInt(e.target.value))}
                className="w-20 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                min={1}
                max={10}
              />
            </div>
          </div>
        )}

        {activeTab === 'web' && (
          <div className="space-y-5">
            <h2 className="text-lg font-medium text-white">Web Channel</h2>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Chat Window Title</label>
              <input
                type="text"
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Greeting Message</label>
              <textarea
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Widget Theme</label>
              <div className="flex gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setWidgetTheme(theme)}
                    className={`w-8 h-8 rounded-full capitalize text-xs text-white font-medium ${
                      theme === 'teal' ? 'bg-teal-600' :
                      theme === 'orange' ? 'bg-orange-500' :
                      theme === 'red' ? 'bg-red-500' :
                      theme === 'green' ? 'bg-green-600' :
                      theme === 'blue' ? 'bg-blue-600' :
                      'bg-gray-800 border border-gray-600'
                    } ${widgetTheme === theme ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''}`}
                  >
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
