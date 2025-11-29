import dynamic from 'next/dynamic';
const LoginForm = dynamic(() => import('../components/Login'), { ssr: false });

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md border">
        <h1 className="text-3xl font-bold mb-6 text-center">🔐 Teos Pi Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
