'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (res.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="max-w-[400px] mx-auto py-20 px-4">
      <h1 className="text-3xl font-black text-center mb-8">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" className="w-full bg-[#1a73e8] text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition">
          Create Account
        </button>
      </form>
      <div className="mt-6 text-center text-sm font-medium text-gray-500">
        Already have an account? <Link href="/login" className="text-[#1a73e8] hover:underline">Login</Link>
      </div>
    </div>
  );
}
