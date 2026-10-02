import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminTabs from './AdminTabs';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  console.log("AdminPage session check:", JSON.stringify(session, null, 2));

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_ADMIN')) {
    redirect('/login');
  }

  // Fetch data for admin
  let data = { users: [] };
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${session.user.backendToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const fullData = await res.json();
      data.users = fullData.users || [];
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <h1 className="text-3xl font-black text-[#123e6b] mb-8">Admin Dashboard</h1>
      <AdminTabs users={data.users} token={session.user.backendToken} userRole={session.user.role} />
    </div>
  );
}
