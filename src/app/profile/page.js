import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import ProfileLogoutButton from './ProfileLogoutButton';

export const metadata = {
  title: 'My Profile - Ezzywalk',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  let orders = [];
  try {
    const res = await fetch('http://localhost:5000/api/orders/me', {
      headers: {
        'Authorization': `Bearer ${session.user.backendToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      orders = await res.json();
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-20">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#123e6b] mb-2">My Profile</h1>
          <p className="text-gray-500 font-medium">Welcome back, {session.user.name || session.user.email}</p>
        </div>
        <div className="flex space-x-3 items-center">
          {(session.user.role === 'ADMIN' || session.user.role === 'MASTER_ADMIN') && (
            <Link href="/admin" className="bg-[#1a73e8] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(26,115,232,0.35)] hover:bg-blue-700 transition-colors">
              Admin Dashboard
            </Link>
          )}
          <ProfileLogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Order History & Tracking</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/products" className="text-[#1a73e8] font-bold hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-xl p-6 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order #{order.id}</p>
                  <p className="font-bold text-lg mb-1">${order.totalAmount}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-sm font-bold text-gray-500 mb-2">Tracking Status</p>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
