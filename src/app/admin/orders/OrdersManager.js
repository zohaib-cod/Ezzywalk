'use client';
import { useState } from 'react';
import ConfirmModal from '../ConfirmModal';

export default function OrdersManager({ initialOrders, token }) {
  const [orders, setOrders] = useState(initialOrders);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(o => o.id === id ? { ...o, status: updatedOrder.status } : o));
      } else {
        alert('Failed to update order status');
      }
    } catch (e) {
      alert('Error updating order status');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Order',
      message: 'Are you sure you want to delete this order? This action cannot be undone.',
      action: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setOrders(orders.filter(o => o.id !== id));
          } else {
            alert('Failed to delete order');
          }
        } catch (e) {
          alert('Error deleting order');
        }
        setConfirmModal({ isOpen: false, title: '', message: '', action: null });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <ConfirmModal 
        isOpen={confirmModal.isOpen} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onConfirm={() => { if (confirmModal.action) confirmModal.action(); }} 
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', action: null })} 
      />
      <h2 className="text-xl font-bold mb-6">Manage Orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-gray-500">Order ID & Date</th>
              <th className="pb-3 text-gray-500">Customer</th>
              <th className="pb-3 text-gray-500">Amount</th>
              <th className="pb-3 text-gray-500">Status</th>
              <th className="pb-3 text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-4">
                  <p className="text-sm font-mono text-gray-600">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-sm">
                      {order.user ? order.user.name || 'User' : order.customerInfo?.customerName || 'Guest'}
                    </p>
                    {order.user && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Registered</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.user ? order.user.email : order.customerInfo?.email || 'N/A'}
                  </p>
                  {!order.user && order.customerInfo?.phone && (
                    <p className="text-xs text-gray-400 mt-1">{order.customerInfo.phone}</p>
                  )}
                </td>
                <td className="py-4 text-sm font-bold text-gray-700">${order.totalAmount}</td>
                <td className="py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 border-green-200' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline text-sm font-bold">Delete</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
