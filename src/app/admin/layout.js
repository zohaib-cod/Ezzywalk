import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingCart, LogOut } from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <Link href="/admin" className="text-xl font-bold tracking-tighter">
            EZZYWALK Admin
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 p-2 rounded">
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          
          <div className="pt-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-500 hover:text-gray-800 p-2 mb-2">
              <LogOut className="w-5 h-5" />
              <span>Back to Store</span>
            </Link>
            <AdminLogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
