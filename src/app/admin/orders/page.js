import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import OrdersManager from './OrdersManager';

export const metadata = {
  title: 'Manage Orders - Admin',
};

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_ADMIN')) {
    redirect('/login');
  }

  let orders = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${session.user.backendToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      orders = data.orders;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div>
      <OrdersManager initialOrders={orders} token={session.user.backendToken} />
    </div>
  );
}
