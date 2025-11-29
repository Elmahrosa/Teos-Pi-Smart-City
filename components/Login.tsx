'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result: any = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/iot-overview');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="admin@teos.local" disabled={loading} />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="••••••" disabled={loading} />
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? 'Signing in...' : 'Sign In'}</button>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <div>Demo: admin@teos.local / admin123</div>
      </div>
    </form>
  );
}
