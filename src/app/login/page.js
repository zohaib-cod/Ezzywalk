'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function BannedModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Account Banned</h3>
          <p className="text-gray-500 text-sm">Your account has been banned by the Master Admin. You can no longer access this system.</p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-center">
          <button onClick={onClose} className="px-8 py-2 bg-red-600 rounded-lg text-white font-bold hover:bg-red-700 transition-colors shadow-md">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogged, setKeepLogged] = useState(false);
  const [error, setError] = useState('');
  const [isBanned, setIsBanned] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      keepLogged: keepLogged ? 'true' : 'false'
    });
    
    if (res?.error) {
      if (res.error.toLowerCase().includes('block') || res.error.toLowerCase().includes('ban')) {
        setIsBanned(true);
        setError('');
      } else {
        setError(res.error === 'CredentialsSignin' ? 'Invalid credentials' : res.error);
      }
    } else {
      router.push('/admin'); // Redirect to admin or profile based on role later
      router.refresh();
    }
  };

  return (
    <div className="max-w-[400px] mx-auto py-20 px-4">
      <BannedModal isOpen={isBanned} onClose={() => setIsBanned(false)} />
      <h1 className="text-3xl font-black text-center mb-8">Login</h1>
      {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="keepLogged" checked={keepLogged} onChange={e => setKeepLogged(e.target.checked)} className="h-4 w-4 text-[#1a73e8] border-gray-300 rounded focus:ring-[#1a73e8]" />
          <label htmlFor="keepLogged" className="ml-2 block text-sm text-gray-700 font-medium">
            Keep me logged in
          </label>
        </div>
        <button type="submit" className="w-full bg-[#1a73e8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition">
          Login
        </button>
      </form>
      <div className="mt-6 text-center text-sm font-medium text-gray-500">
        Don't have an account? <Link href="/register" className="text-[#1a73e8] hover:underline">Sign Up</Link>
      </div>
    </div>
  );
}
