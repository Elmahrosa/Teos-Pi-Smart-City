'use client';
import useSWR from 'swr';
const fetcher = (url) => fetch(url).then(r=>r.json());
export default function BadgeDefinitions() {
  const { data } = useSWR('/api/iot/badges/definitions', fetcher);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">📜 Civic Rules</h2>
      <div className="space-y-3">{data.map(def=>(
        <div key={def.id} className="p-3 border rounded"><div className="flex gap-3"><div className="text-2xl">{def.icon}</div><div><div className="font-semibold">{def.name}</div><div className="text-sm text-gray-600">{def.description}</div><div className="text-xs mt-1 font-mono">Rule: {JSON.stringify(def.rule)}</div></div></div></div>
      ))}</div>
    </div>
  );
}
