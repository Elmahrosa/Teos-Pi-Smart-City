'use client';
import useSWR from 'swr';
import 'leaflet/dist/leaflet.css';
const fetcher = (url: string) => fetch(url).then(r => r.json());
export default function CityHeatmap() {
  const { data } = useSWR('/api/iot/telemetry', fetcher);
  if (!data) return <div>Loading map...</div>;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border h-96">
      <h2 className="text-xl font-bold mb-4">🗺️ City Sensor Heatmap</h2>
      <div className="text-sm text-gray-600">Map placeholder — install react-leaflet in real app.</div>
    </div>
  );
}
