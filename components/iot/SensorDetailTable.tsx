'use client';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());
export default function SensorDetailTable() {
  const { data, error } = useSWR('/api/iot/telemetry', fetcher, { refreshInterval: 10000 });
  if (error) return <div>Failed to load telemetry</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">📡 Sensor Details (24h)</h2>
      <table className="w-full text-sm"><thead><tr><th>Timestamp</th><th>Device ID</th><th>Metric</th><th className="text-right">Value</th></tr></thead><tbody>
        {data.map((row,i)=>(
          <tr key={i} className="border-t"><td>{new Date(row.ts).toLocaleString()}</td><td className="font-mono">{row.device_id}</td><td>{row.metric}</td><td className="text-right">{row.value}</td></tr>
        ))}
      </tbody></table>
    </div>
  );
}
