'use client';
import useSWR from 'swr';
import { useState } from 'react';
import BadgeForm from './BadgeForm';
const fetcher = (url) => fetch(url).then(r=>r.json());

export default function BadgeAdminPanel() {
  const { data, mutate } = useSWR('/api/iot/badges/definitions', fetcher);
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id) => { if(!confirm('Delete this badge rule?')) return; await fetch(`/api/iot/badges/definitions/${id}`, { method: 'DELETE' }); mutate(); }
  const handleToggle = async (id, enabled) => { await fetch(`/api/iot/badges/definitions/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ enabled: !enabled }) }); mutate(); }

  if (!data) return <div>Loading...</div>;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl">Badge Rules Management</h1><button onClick={()=>setEditing({})} className="px-4 py-2 bg-blue-600 text-white rounded">+ New Rule</button></div>
      {editing!==null && <BadgeForm definition={editing} onClose={()=>setEditing(null)} onSave={()=>mutate()} />}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th>Badge</th><th>Rule</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{data.map(def=>(
            <tr key={def.id} className="border-t"><td className="px-4 py-3"><div className="flex items-center gap-3"><span className="text-2xl">{def.icon}</span><div><div className="font-medium">{def.name}</div><div className="text-sm">{def.description}</div></div></div></td><td className="px-4 py-3 font-mono text-sm">{JSON.stringify(def.rule)}</td><td className="px-4 py-3">{def.enabled ? 'Active' : 'Disabled'}</td><td className="px-4 py-3 text-right space-x-2"><button onClick={()=>setEditing(def)} className="text-sm text-blue-600">Edit</button><button onClick={()=>handleToggle(def.id, def.enabled)} className="text-sm text-purple-600">{def.enabled?'Disable':'Enable'}</button><button onClick={()=>handleDelete(def.id)} className="text-sm text-red-600">Delete</button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
