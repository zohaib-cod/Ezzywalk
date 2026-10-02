'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [useMasterPassword, setUseMasterPassword] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!useMasterPassword && !password) return alert('Enter a password or use master password');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/auth/admin-accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, name, password, useMasterPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Co-Admin Account created successfully! You can now login.');
        router.push('/login');
      } else {
        alert(data.error || 'Failed to accept invitation');
      }
    } catch(err) {
      alert('Error connecting to server');
    }
  };

  if (!token || !email) {
    return <div className="text-center p-10 text-red-600">Invalid invitation link.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Accept Co-Admin Invite</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold">Email</label>
          <input type="email" disabled value={email} className="w-full border p-2 rounded bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-bold">Full Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        
        <div className="border-t pt-4">
          <label className="block text-sm font-bold mb-2">Password Setup</label>
          <div className="flex items-center space-x-2 mb-2">
            <input type="checkbox" id="masterpwd" checked={useMasterPassword} onChange={e => setUseMasterPassword(e.target.checked)} />
            <label htmlFor="masterpwd" className="text-sm">Use Master Admin's Password</label>
          </div>
          
          {!useMasterPassword && (
            <div>
              <input type="password" placeholder="Generate your own password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
            </div>
          )}
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded mt-4 hover:bg-blue-700">
          Create Admin Account
        </button>
      </form>
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">Go to Login</Link>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
