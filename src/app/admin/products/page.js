import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ProductsManager from './ProductsManager';

export const metadata = {
  title: 'Manage Products - Admin',
};

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MASTER_ADMIN')) {
    redirect('/login');
  }

  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${session.user.backendToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      products = data.products;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div>
      <ProductsManager initialProducts={products} token={session.user.backendToken} />
    </div>
  );
}
