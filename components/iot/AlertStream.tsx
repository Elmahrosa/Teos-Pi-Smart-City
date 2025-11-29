'use client';
import { useState, useEffect } from 'react';
export default function AlertStream() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const es = new EventSource('/api/iot/alerts/stream');
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed.type === 'alert') setAlerts(prev => [parsed.data, ...prev].slice(0,20));
      } catch {}
    };
    return () => es.close();
  }, []);
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">🚨 Live Alerts</h2>
      {alerts.length===0 ? <div className="text-gray-500">No recent alerts</div> : alerts.map(a=>(
        <div key={a.id} className="p-3 border mb-2"><div className="font-semibold">{a.message}</div><div className="text-xs text-gray-600">{a.device_id} • {a.created_at}</div></div>
      ))}
    </div>
  );
}
