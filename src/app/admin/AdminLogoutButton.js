'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex w-full items-center space-x-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>Log Out</span>
    </button>
  );
}
