'use client';
import { useState } from 'react';
export default function BadgeForm({ definition, onClose, onSave }) {
  const [form, setForm] = useState({
    name: definition.name || '',
    description: definition.description || '',
    icon: definition.icon || '🏅',
    rule: JSON.stringify(definition.rule || { metric: 'air_quality', operator: '>', threshold: 90 }, null, 2),
    enabled: definition.enabled !== undefined ? definition.enabled : true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = definition.id ? `/api/iot/badges/definitions/${definition.id}` : '/api/iot/badges/definitions';
      const method = definition.id ? 'PUT' : 'POST';
      await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...form, rule: JSON.parse(form.rule) }) });
      onSave(); onClose();
    } catch (err) { alert('Failed to save badge rule'); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-2xl w-full">
        <h2 className="text-xl mb-4">{definition.id ? 'Edit Badge Rule' : 'Create New Badge Rule'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm">Name</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border" /></div>
          <div><label className="block text-sm">Description</label><textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border" rows={3} /></div>
          <div><label className="block text-sm">Icon</label><input required maxLength={4} value={form.icon} onChange={e=>setForm({...form, icon:e.target.value})} className="w-full px-3 py-2 border" /></div>
          <div><label className="block text-sm">Rule (JSON)</label><textarea required value={form.rule} onChange={e=>setForm({...form, rule: e.target.value})} className="w-full px-3 py-2 border font-mono" rows={6} /></div>
          <div className="flex items-center"><input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form, enabled: e.target.checked})} /> <label className="ml-2">Enabled</label></div>
          <div className="flex gap-3"><button className="px-4 py-2 bg-blue-600 text-white rounded">Save Rule</button><button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button></div>
        </form>
      </div>
    </div>
  );
}
