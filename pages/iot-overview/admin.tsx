import dynamic from 'next/dynamic';
import Header from '../../components/Header';
const AdminGuard = dynamic(() => import('../../components/AdminGuard'), { ssr: false });
const BadgeAdminPanel = dynamic(() => import('../../components/iot/BadgeAdminPanel'), { ssr: false });

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminGuard>
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">🔧 IoT Governance Admin</h1>
            <a href="/iot-overview" className="text-blue-600">← Back to Dashboard</a>
          </div>
          <BadgeAdminPanel />
        </main>
      </AdminGuard>
    </div>
  );
}
