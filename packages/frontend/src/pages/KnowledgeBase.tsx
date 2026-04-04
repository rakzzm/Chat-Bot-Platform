import { useState, useEffect } from 'react';
import { getKnowledgeBases, createKnowledgeBase, deleteKnowledgeBase } from '../lib/api';
import type { KnowledgeBase as KBType } from '../types';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function KnowledgeBase() {
  const [knowledgeBases, setKnowledgeBases] = useState<KBType[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newKB, setNewKB] = useState({ title: '', contentType: 'faq' });

  useEffect(() => {
    getKnowledgeBases().then((data) => setKnowledgeBases(data)).catch(() => setKnowledgeBases([]));
  }, []);

  const createKB = async () => {
    if (!newKB.title.trim()) return;
    try {
      const data = await createKnowledgeBase(newKB);
      setKnowledgeBases((prev) => [...prev, data]);
      setNewKB({ title: '', contentType: 'faq' });
      setShowCreate(false);
    } catch {}
  };

  const handleDeleteKB = async (id: string) => {
    if (!confirm('Delete this knowledge base?')) return;
    await deleteKnowledgeBase(id);
    setKnowledgeBases((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-700 flex items-center gap-1 text-sm"
        >
          <Plus size={14} /> New Content Type
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newKB.title}
              onChange={(e) => setNewKB({ ...newKB, title: e.target.value })}
              placeholder="Content type name (e.g., FAQs, Products)"
              className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            />
            <select
              value={newKB.contentType}
              onChange={(e) => setNewKB({ ...newKB, contentType: e.target.value })}
              className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="faq">FAQ</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="custom">Custom</option>
            </select>
            <button onClick={createKB} className="bg-teal-600 text-white px-4 py-2 rounded text-sm">Create</button>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 px-3 py-2 text-sm hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {knowledgeBases.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No knowledge base content types yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBases.map((kb) => (
            <div key={kb.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium">{kb.title}</h3>
                  <span className="text-xs text-gray-500 capitalize">{kb.contentType}</span>
                </div>
                <button onClick={() => handleDeleteKB(kb.id)} className="text-gray-500 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                {kb.entries?.length || 0} entries
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
