'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ProfileLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center space-x-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-red-100 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Log Out</span>
    </button>
  );
}
