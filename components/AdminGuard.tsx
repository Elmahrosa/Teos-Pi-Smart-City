'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/403');
  }, [status, session, router]);

  if (status === 'loading') return <div className="h-64 flex items-center justify-center">Loading...</div>;
  if (status === 'authenticated' && session?.user?.role === 'admin') return <>{children}</>;
  return null;
}
