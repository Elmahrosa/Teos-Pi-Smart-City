'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/iot-overview" className="text-xl font-bold text-gray-800">🏙️ Teos Pi Smart City</Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600 font-mono">{session.user?.email} <span className="text-purple-600">({session.user?.role})</span></span>
              {session.user?.role === 'admin' && (
                <Link href="/iot-overview/admin" className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded">🔧 Admin Panel</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-sm px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <Link href="/login" className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
