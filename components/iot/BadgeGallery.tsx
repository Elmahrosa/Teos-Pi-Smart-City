'use client';
import { useEffect, useState } from 'react';
export default function BadgeGallery() {
  const [badges, setBadges] = useState([]);
  useEffect(()=>{ fetch('/api/iot/badges').then(r=>r.json()).then(setBadges).catch(()=>{}); }, []);
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold mb-4">🏅 Civic Badges</h2>
      {badges.length===0 ? <div className="text-gray-500">No badges earned yet</div> : <div className="grid grid-cols-3 gap-3">{badges.map(b=>(
        <div key={b.id} className="p-3 text-center border rounded">{b.icon}<div className="text-xs">{b.name}</div></div>
      ))}</div>}
    </div>
  );
}
