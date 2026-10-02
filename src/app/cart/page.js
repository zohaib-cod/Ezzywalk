"use client";
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isClient } = useCart();

  if (!isClient) return <div className="max-w-[1050px] mx-auto px-4 py-16 text-center">Loading cart...</div>;

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 mb-6">Your shopping cart is empty.</p>
          <Link href="/products" className="bg-[#1a73e8] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex border rounded-2xl p-4 items-center space-x-6 relative">
                <div className="w-24 h-24 bg-[#f3f5f7] rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                  <img src={item.imageUrl || "/categories/sneaker.png"} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mb-1">EZZYWALK</p>
                  <Link href={`/products/${item.id}`} className="font-bold text-lg hover:text-[#1a73e8] transition">{item.name}</Link>
                  <p className="font-bold text-gray-900 mt-1">Rs {item.price}</p>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-3 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-[#1a73e8]"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-[#1a73e8]"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 h-fit border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs {cartTotal}</span>
            </div>
            <div className="flex justify-between mb-6 text-gray-600 border-b pb-6">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-8 text-lg font-black">
              <span>Total</span>
              <span>Rs {cartTotal}</span>
            </div>
            <Link href="/checkout" className="w-full block text-center bg-[#1a73e8] text-white px-6 py-4 rounded-full font-bold hover:bg-blue-600 transition shadow-lg">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
