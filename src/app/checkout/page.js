"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { createOrder } from './actions';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isClient } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isClient) return null;
  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get('firstName') + ' ' + formData.get('lastName'),
      email: formData.get('email'),
      address: formData.get('address') + ', ' + formData.get('city'),
      phone: formData.get('phone'),
      totalAmount: cartTotal,
      itemsJson: JSON.stringify(cart)
    };
    
    try {
      await createOrder(orderData);
      clearCart();
      router.push('/checkout/success');
    } catch (e) {
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[1050px] mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-10 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-xl font-bold mb-6">Contact & Shipping</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
              <input type="text" name="lastName" placeholder="Last Name" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
            </div>
            <input type="email" name="email" placeholder="Email Address" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
            <input type="tel" name="phone" placeholder="Phone Number" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
            <input type="text" name="address" placeholder="Street Address" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
            <input type="text" name="city" placeholder="City" required className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#1a73e8] focus:outline-none" />
            
            <h2 className="text-xl font-bold mt-8 mb-4 pt-4 border-t">Payment Method</h2>
            <div className="border rounded-lg p-4 bg-gray-50 flex items-center mb-6">
              <input type="radio" checked readOnly className="w-4 h-4 text-[#1a73e8]" />
              <span className="ml-3 font-semibold">Cash on Delivery (COD)</span>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full bg-[#1a73e8] text-white px-6 py-4 rounded-full font-bold hover:bg-blue-600 transition shadow-lg disabled:opacity-50">
              {isSubmitting ? 'Placing Order...' : 'Complete Order'}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Items</h2>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1 border relative">
                  <img src={item.imageUrl || "/categories/sneaker.png"} alt={item.name} className="w-full h-full object-contain" />
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Rs {item.price}</p>
                </div>
                <div className="font-bold text-sm">
                  Rs {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs {cartTotal}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600 border-b pb-4">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">Free</span>
            </div>
            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>Rs {cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
