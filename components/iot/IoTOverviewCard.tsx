'use client';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function IoTOverviewCard() {
  const { data, error } = useSWR('/api/iot/metrics', fetcher, { refreshInterval: 30000 });
  if (error) return <div>Failed to load metrics</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-xl font-bold mb-4">📊 IoT Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded"> <div className="text-2xl font-bold">{data.totalDevices}</div><div className="text-sm">Active Devices</div></div>
        <div className="p-4 border rounded"> <div className="text-2xl font-bold">{data.activeAlerts}</div><div className="text-sm">Active Alerts</div></div>
        <div className="p-4 border rounded"> <div className="text-2xl font-bold">{data.avgAirQuality}</div><div className="text-sm">Avg Air Quality</div></div>
        <div className="p-4 border rounded"> <div className="text-2xl font-bold">{data.energyEfficiency}</div><div className="text-sm">Energy Efficiency</div></div>
      </div>
    </div>
  );
}
