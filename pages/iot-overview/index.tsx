import dynamic from 'next/dynamic';
import Header from '../../components/Header';
const IoTOverviewCard = dynamic(() => import('../../components/iot/IoTOverviewCard'), { ssr: false });
const AlertStream = dynamic(() => import('../../components/iot/AlertStream'), { ssr: false });
const SensorDetailTable = dynamic(() => import('../../components/iot/SensorDetailTable'), { ssr: false });
const CityHeatmap = dynamic(() => import('../../components/iot/CityHeatmap'), { ssr: false });
const BadgeGallery = dynamic(() => import('../../components/iot/BadgeGallery'), { ssr: false });
const BadgeDefinitions = dynamic(() => import('../../components/iot/BadgeDefinitions'), { ssr: false });

export default function IoTDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><IoTOverviewCard /></div>
          <div><BadgeGallery /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertStream />
          <BadgeDefinitions />
        </div>
        <SensorDetailTable />
        <CityHeatmap />
      </main>
    </div>
  );
}
