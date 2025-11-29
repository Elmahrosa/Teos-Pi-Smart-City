import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow text-center border max-w-lg">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-3">Access Forbidden</h2>
        <p className="text-gray-600 mb-6">You don't have permission to access this resource. This area is restricted to administrators only.</p>
        <Link href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded">Return to Login</Link>
      </div>
    </div>
  );
}
